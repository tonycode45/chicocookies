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
      items,
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
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    // Validate and resolve each item
    const resolvedItems = []
    for (const item of items) {
      const tier = getTierById(item.tierId as TierId)
      if (!tier) {
        return NextResponse.json({ error: `Invalid tier: ${item.tierId}` }, { status: 400 })
      }
      const qty = Math.max(1, Number(item.qty) || 1)
      resolvedItems.push({
        tierId: tier.id,
        tierLabel: tier.label,
        qty,
        unitPrice: tier.price,
        lineTotal: tier.price * qty,
        cookies: tier.cookies * qty,
      })
    }

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0)
    const cookiesTotal = resolvedItems.reduce((sum, i) => sum + i.cookies, 0)
    const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
    const total = subtotal + deliveryFee

    const order = createOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      fulfillment,
      address: address?.trim() || undefined,
      city: city?.trim() || undefined,
      items: resolvedItems,
      cookiesTotal,
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
