import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail, toPublicOrder } from '@/lib/db/orders'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  const orders = await getOrdersByEmail(email.trim())
  // Lookup only requires knowing an email, so never return PII (phone, address, etc.).
  return NextResponse.json(orders.map(toPublicOrder))
}
