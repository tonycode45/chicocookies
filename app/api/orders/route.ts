import { NextRequest, NextResponse } from 'next/server'
import { createOrder, readOrders } from '@/lib/orders'
import { getTierById, TierId } from '@/lib/tiers'

const DELIVERY_FEE = 5

function isAuthorized(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'cookies2024')
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(readOrders())
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      phone,
      email,
      fulfillment,
      address,
      city,
      tierId,
      packs,
      notes,
      weeklyDrop,
      isEventOrder,
      referredBy,
    } = body

    if (!customerName?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }
    if (fulfillment === 'delivery' && (!address?.trim() || !city?.trim())) {
      return NextResponse.json({ error: 'Address and city required for delivery' }, { status: 400 })
    }

    const tier = getTierById(tierId as TierId)
    if (!tier) {
      return NextResponse.json({ error: 'Invalid tier selected' }, { status: 400 })
    }

    const numPacks = Math.max(1, Number(packs) || 1)
    const subtotal = tier.price * numPacks
    const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
    const total = subtotal + deliveryFee

    const order = createOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      fulfillment,
      address: address?.trim() || undefined,
      city: city?.trim() || undefined,
      tierId: tier.id,
      tierLabel: tier.label,
      packs: numPacks,
      cookiesTotal: tier.cookies * numPacks,
      subtotal,
      deliveryFee,
      total,
      notes: notes?.trim() || undefined,
      weeklyDrop: Boolean(weeklyDrop),
      isEventOrder: Boolean(isEventOrder),
      referredBy: referredBy?.trim() || undefined,
    })

    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
