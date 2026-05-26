import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrders } from '@/lib/db/orders'
import { getTierById, TierId } from '@/lib/tiers'

const DELIVERY_FEE = 500 // cents

function isAuthorized(req: NextRequest) {
  return !!process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getOrders())
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, phone, email, fulfillment, address, city, items, notes, weeklyDrop, isEventOrder, referredBy } = body

    if (!customerName?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name, phone, and email are required' }, { status: 400 })
    }
    if (fulfillment === 'delivery' && (!address?.trim() || !city?.trim())) {
      return NextResponse.json({ error: 'Address and city required for delivery' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    const resolvedItems = []
    for (const item of items) {
      const tier = getTierById(item.tierId as TierId)
      if (!tier) return NextResponse.json({ error: `Invalid tier: ${item.tierId}` }, { status: 400 })
      const qty = Math.max(1, Number(item.qty) || 1)
      resolvedItems.push({
        tierId: tier.id, tierLabel: tier.label, qty,
        unitPrice: tier.price * 100,
        lineTotal: tier.price * 100 * qty,
        cookies: tier.cookies * qty,
      })
    }

    const subtotal = resolvedItems.reduce((s, i) => s + i.lineTotal, 0)
    const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
    const order = await createOrder({
      id: `CC-${Date.now()}`,
      customerName: customerName.trim(), phone: phone.trim(), email: email.trim(),
      fulfillment, address: address?.trim() || undefined, city: city?.trim() || undefined,
      items: resolvedItems,
      cookiesTotal: resolvedItems.reduce((s, i) => s + i.cookies, 0),
      subtotal, deliveryFee, total: subtotal + deliveryFee,
      notes: notes?.trim() || undefined,
      weeklyDrop: Boolean(weeklyDrop), isEventOrder: Boolean(isEventOrder),
      referredBy: referredBy?.trim() || undefined,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
