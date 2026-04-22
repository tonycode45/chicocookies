import { NextRequest, NextResponse } from 'next/server'
import getStripe from '@/lib/stripe'
import { updateOrderStatus } from '@/lib/db/orders'
import { createSubscription, updateSubscriptionStatus } from '@/lib/db/subscriptions'
import { sendReceiptEmail } from '@/lib/email/receipt'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (session.mode === 'payment' && orderId) {
      await updateOrderStatus(orderId, 'confirmed')
      if (session.customer_email) {
        await sendReceiptEmail({
          to: session.customer_email,
          orderId,
          total: session.amount_total ?? 0,
        })
      }
    }

    if (session.mode === 'subscription' && session.subscription) {
      const sub = await getStripe().subscriptions.retrieve(session.subscription as string)
      const md = session.metadata ?? {}
      await createSubscription({
        customerEmail: session.customer_email ?? '',
        customerName: md.customerName ?? '',
        phone: md.phone ?? '',
        fulfillment: (md.fulfillment as 'pickup' | 'delivery') ?? 'pickup',
        tierId: (md.tierId as 'small' | 'medium' | 'large') ?? 'medium',
        status: 'active',
        stripeSubscriptionId: sub.id,
        stripeCustomerId: sub.customer as string,
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await updateSubscriptionStatus(sub.id, 'cancelled')
  }

  if (event.type === 'customer.subscription.paused') {
    const sub = event.data.object as Stripe.Subscription
    await updateSubscriptionStatus(sub.id, 'paused')
  }

  if (event.type === 'customer.subscription.resumed') {
    const sub = event.data.object as Stripe.Subscription
    await updateSubscriptionStatus(sub.id, 'active')
  }

  return NextResponse.json({ received: true })
}
