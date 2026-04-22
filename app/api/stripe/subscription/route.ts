import { NextRequest, NextResponse } from 'next/server'
import getStripe from '@/lib/stripe'

const PRICE_MAP: Record<string, string | undefined> = {
  small: process.env.STRIPE_PRICE_SMALL_WEEKLY,
  medium: process.env.STRIPE_PRICE_MEDIUM_WEEKLY,
  large: process.env.STRIPE_PRICE_LARGE_WEEKLY,
}

export async function POST(req: NextRequest) {
  try {
    const { tierId, customerName, phone, email, fulfillment } = await req.json()

    if (!tierId || !email?.trim() || !customerName?.trim()) {
      return NextResponse.json({ error: 'tierId, email, and name are required' }, { status: 400 })
    }

    const priceId = PRICE_MAP[tierId]
    if (!priceId) {
      return NextResponse.json({ error: 'Subscription prices not configured on server' }, { status: 500 })
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email.trim(),
      metadata: {
        tierId,
        customerName: customerName.trim(),
        phone: phone?.trim() ?? '',
        fulfillment: fulfillment ?? 'pickup',
      },
      success_url: `${origin}/subscribe?success=1&email=${encodeURIComponent(email.trim())}`,
      cancel_url: `${origin}/subscribe`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
