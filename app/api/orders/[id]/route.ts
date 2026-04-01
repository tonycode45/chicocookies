import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, OrderStatus } from '@/lib/orders'

const VALID_STATUSES: OrderStatus[] = [
  'new',
  'confirmed',
  'baking',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled',
]

function isAuthorized(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password')
  return pwd === (process.env.ADMIN_PASSWORD || 'cookies2024')
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await req.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const order = updateOrderStatus(params.id, status as OrderStatus)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  return NextResponse.json(order)
}
