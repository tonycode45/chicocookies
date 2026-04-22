import { NextRequest, NextResponse } from 'next/server'
import getStripe from '@/lib/stripe'
import { createOrder } from '@/lib/db/orders'
import { getTierById, TierId } from '@/lib/tiers'

const DELIVERY_FEE = 500 // cents

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, phone, email, fulfillment, address, city, items, notes, isEventOrder, referredBy } = body

    if (!customerName?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name, phone, and email are required' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }
    if (fulfillment === 'delivery' && (!address?.trim() || !city?.trim())) {
      return NextResponse.json({ error: 'Address and city required for delivery' }, { status: 400 })
    }

    const resolved = []
    for (const item of items) {
      const tier = getTierById(item.tierId as TierId)
      if (!tier) return NextResponse.json({ error: `Invalid tier: ${item.tierId}` }, { status: 400 })
      const qty = Math.max(1, Number(item.qty) || 1)
      resolved.push({ tier, qty })
    }

    const dbItems = resolved.map(({ tier, qty }) => ({
      tierId: tier.id, tierLabel: tier.label, qty,
      unitPrice: tier.price * 100,
      lineTotal: tier.price * 100 * qty,
      cookies: tier.cookies * qty,
    }))
    const subtotal = dbItems.reduce((s, i) => s + i.lineTotal, 0)
    const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
    const orderId = `CC-${Date.now()}`

    await createOrder({
      id: orderId,
      customerName: customerName.trim(), phone: phone.trim(), email: email.trim(),
      fulfillment, address: address?.trim() || undefined, city: city?.trim() || undefined,
      items: dbItems,
      cookiesTotal: dbItems.reduce((s, i) => s + i.cookies, 0),
      subtotal, deliveryFee, total: subtotal + deliveryFee,
      notes: notes?.trim() || undefined,
      weeklyDrop: false, isEventOrder: Boolean(isEventOrder),
      referredBy: referredBy?.trim() || undefined,
    })

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const lineItems = resolved.map(({ tier, qty }) => ({
      price_data: {
        currency: 'cad',
        product_data: { name: `${tier.label} — Chicoine Cookies` },
        unit_amount: tier.price * 100,
      },
      quantity: qty,
    }))
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: { name: 'Delivery fee' },
          unit_amount: deliveryFee,
        },
        quantity: 1,
      })
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email.trim(),
      metadata: { orderId },
      success_url: `${origin}/order-confirmation/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
