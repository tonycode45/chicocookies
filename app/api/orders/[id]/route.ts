import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus, OrderStatus } from '@/lib/db/orders'

function isAuthorized(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'cookies2024')
}

const VALID_STATUSES = ['new','confirmed','baking','ready','out_for_delivery','completed','cancelled']

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { status } = await req.json()
  if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  const order = await updateOrderStatus(params.id, status as OrderStatus)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}
