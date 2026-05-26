import { NextRequest, NextResponse } from 'next/server'
import getStripe from '@/lib/stripe'
import { getSubscriptionByEmail } from '@/lib/db/subscriptions'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const sub = await getSubscriptionByEmail(email.trim())
    if (!sub) return NextResponse.json({ error: 'No active subscription found for this email' }, { status: 404 })

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const session = await getStripe().billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${origin}/subscribe`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
