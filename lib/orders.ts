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

export interface Order {
  id: string
  createdAt: string
  customerName: string
  phone: string
  email: string
  fulfillment: 'pickup' | 'delivery'
  address?: string
  city?: string
  tierId: string
  tierLabel: string
  packs: number
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
    return JSON.parse(raw)
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
  const orders = readOrders()
  const order: Order = {
    ...data,
    id: `CC-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  }
  orders.unshift(order)
  writeOrders(orders)
  return order
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null
  orders[idx].status = status
  writeOrders(orders)
  return orders[idx]
}
