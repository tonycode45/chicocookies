import sql from '@/lib/db'

export type OrderStatus =
  | 'new' | 'confirmed' | 'baking' | 'ready'
  | 'out_for_delivery' | 'completed' | 'cancelled'

export interface OrderItem {
  tierId: string
  tierLabel: string
  qty: number
  unitPrice: number  // cents
  lineTotal: number  // cents
  cookies: number
}

export interface Order {
  id: string
  createdAt: string
  customerName: string
  phone: string
  email: string
  fulfillment: 'pickup' | 'delivery'
  address?: string
  city?: string
  items: OrderItem[]
  cookiesTotal: number
  subtotal: number    // cents
  deliveryFee: number // cents
  total: number       // cents
  status: OrderStatus
  notes?: string
  weeklyDrop: boolean
  isEventOrder: boolean
  referredBy?: string
  stripePaymentIntentId?: string
}

export interface PublicOrder {
  id: string
  createdAt: string
  status: OrderStatus
  fulfillment: 'pickup' | 'delivery'
  items: OrderItem[]
  cookiesTotal: number
  total: number
}

// Safe projection for public (unauthenticated) endpoints — no customer PII.
export function toPublicOrder(o: Order): PublicOrder {
  return {
    id: o.id,
    createdAt: o.createdAt,
    status: o.status,
    fulfillment: o.fulfillment,
    items: o.items,
    cookiesTotal: o.cookiesTotal,
    total: o.total,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    fulfillment: row.fulfillment,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    items: row.items,
    cookiesTotal: row.cookies_total,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    status: row.status,
    notes: row.notes ?? undefined,
    weeklyDrop: row.weekly_drop,
    isEventOrder: row.is_event_order,
    referredBy: row.referred_by ?? undefined,
    stripePaymentIntentId: row.stripe_payment_intent_id ?? undefined,
  }
}

export async function getOrders(): Promise<Order[]> {
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`
  return rows.map(rowToOrder)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const rows = await sql`SELECT * FROM orders WHERE id = ${id}`
  return rows[0] ? rowToOrder(rows[0]) : null
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const rows = await sql`
    SELECT * FROM orders WHERE lower(email) = lower(${email}) ORDER BY created_at DESC
  `
  return rows.map(rowToOrder)
}

export async function createOrder(data: Omit<Order, 'createdAt' | 'status'>): Promise<Order> {
  const rows = await sql`
    INSERT INTO orders (
      id, customer_name, phone, email, fulfillment, address, city,
      items, cookies_total, subtotal, delivery_fee, total,
      notes, weekly_drop, is_event_order, referred_by, stripe_payment_intent_id
    ) VALUES (
      ${data.id}, ${data.customerName}, ${data.phone}, ${data.email},
      ${data.fulfillment}, ${data.address ?? null}, ${data.city ?? null},
      ${JSON.stringify(data.items)}, ${data.cookiesTotal}, ${data.subtotal},
      ${data.deliveryFee}, ${data.total}, ${data.notes ?? null},
      ${data.weeklyDrop}, ${data.isEventOrder}, ${data.referredBy ?? null},
      ${data.stripePaymentIntentId ?? null}
    )
    RETURNING *
  `
  return rowToOrder(rows[0])
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const rows = await sql`
    UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *
  `
  return rows[0] ? rowToOrder(rows[0]) : null
}
