import fs from 'fs'
import path from 'path'

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'baking'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'

export interface OrderItem {
  tierId: string
  tierLabel: string
  qty: number
  unitPrice: number
  lineTotal: number
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
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  notes?: string
  weeklyDrop?: boolean
  isEventOrder?: boolean
  referredBy?: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json')

export function readOrders(): Order[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Order[]
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2))
}

export function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  if (!data.items || data.items.length === 0) {
    throw new Error('Order must contain at least one item')
  }
  if (data.fulfillment === 'delivery' && !data.address?.trim()) {
    throw new Error('Street address is required for delivery orders')
  }
  if (data.fulfillment === 'delivery' && !data.city?.trim()) {
    throw new Error('City is required for delivery orders')
  }

  // Recompute lineTotal for each item to ensure it matches qty * unitPrice.
  const sanitisedItems: OrderItem[] = data.items.map((item) => ({
    ...item,
    lineTotal: item.qty * item.unitPrice,
  }))

  const orders = readOrders()
  const order: Order = {
    ...data,
    items: sanitisedItems,
    id: `CC-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  }
  orders.unshift(order)
  writeOrders(orders)
  return order
}

export function getOrderById(id: string): Order | null {
  const orders = readOrders()
  return orders.find((o) => o.id === id) ?? null
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null
  orders[idx].status = status
  writeOrders(orders)
  return orders[idx]
}
