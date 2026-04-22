'use client'

import { useState, useEffect } from 'react'

type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'baking'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'

interface OrderItem {
  tierId: string
  tierLabel: string
  qty: number
  unitPrice: number
  lineTotal: number
  cookies: number
}

interface Order {
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

interface ShopSettings {
  acceptingOrders: boolean
  batchInfo: string
  availableSpots: number
  cutoffTime: string
  pickupInstructions: string
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  baking: 'Baking',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-amber-50 text-amber-700 border-amber-200',
  baking: 'bg-orange-50 text-orange-700 border-orange-200',
  ready: 'bg-green-50 text-green-700 border-green-200',
  out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-stone-100 text-stone-500 border-stone-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'confirmed',
  confirmed: 'baking',
  baking: 'ready',
  ready: 'completed',
  out_for_delivery: 'completed',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [savedPassword, setSavedPassword] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [stats, setStats] = useState<{ weekTotal: number; monthTotal: number; activeSubscribers: number } | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('admin-password')
    if (saved) {
      setSavedPassword(saved)
      fetchAll(saved)
    }
  }, [])

  const fetchAll = async (pwd: string) => {
    setLoading(true)
    setError('')
    try {
      const [ordersRes, settingsRes] = await Promise.all([
        fetch('/api/orders', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/settings'),
      ])
      if (ordersRes.status === 401) {
        setError('Incorrect password.')
        setSavedPassword(null)
        sessionStorage.removeItem('admin-password')
        return
      }
      if (!ordersRes.ok) throw new Error('Failed to load orders.')
      setOrders(await ordersRes.json())
      const statsRes = await fetch('/api/admin/stats', { headers: { 'x-admin-password': pwd } })
      if (statsRes.ok) setStats(await statsRes.json())
      if (settingsRes.ok) setSettings(await settingsRes.json())
      setSavedPassword(pwd)
      sessionStorage.setItem('admin-password', pwd)
    } catch {
      setError('Unable to reach server.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    fetchAll(password.trim())
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': savedPassword! },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update status.')
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch {
      alert('Failed to update status.')
    }
  }

  const saveSettings = async (updates: Partial<ShopSettings>) => {
    if (!settings) return
    const optimistic = { ...settings, ...updates }
    setSettings(optimistic)
    setSettingsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': savedPassword! },
        body: JSON.stringify(updates),
      })
      if (res.ok) setSettings(await res.json())
    } catch {
      alert('Failed to save settings.')
    } finally {
      setSettingsSaving(false)
    }
  }

  const logout = () => {
    setSavedPassword(null)
    sessionStorage.removeItem('admin-password')
    setOrders([])
    setPassword('')
    setSettings(null)
  }

  /* ── Login ── */
  if (!savedPassword) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] dark:bg-stone-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-serif text-2xl text-stone-900 dark:text-stone-100 tracking-wide mb-1">Chicoine Cookies</p>
            <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-sans">Admin Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-2 font-sans">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-stone-300 dark:border-stone-600 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-600 text-sm focus:outline-none focus:border-stone-700 dark:focus:border-stone-400 transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 dark:bg-stone-100 hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-50 text-white dark:text-stone-900 text-xs tracking-widest uppercase font-sans font-medium py-3.5 transition-colors mt-2"
            >
              {loading ? 'Verifying…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  /* ── Dashboard ── */
  const newCount = orders.filter((o) => o.status === 'new').length
  const weeklyDropCount = orders.filter((o) => o.weeklyDrop).length
  const eventOrderCount = orders.filter((o) => o.isEventOrder && !['completed', 'cancelled'].includes(o.status)).length
  const activeOrders = orders.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const pastOrders = orders.filter((o) => ['completed', 'cancelled'].includes(o.status))

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 font-sans">
      {/* Header */}
      <div className="bg-stone-950 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif text-stone-100">Chicoine</span>
          <span className="text-stone-600 text-xs">—</span>
          <span className="text-xs tracking-widest uppercase text-stone-500">Orders</span>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <span className="bg-gold text-stone-950 text-xs font-bold px-2 py-0.5">
              {newCount} New
            </span>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`text-xs tracking-widest uppercase transition-colors ${showSettings ? 'text-gold' : 'text-stone-500 hover:text-stone-300'}`}
          >
            Settings
          </button>
          <button
            onClick={() => fetchAll(savedPassword)}
            className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-300 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={logout}
            className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {stats && (
        <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex gap-6 text-xs font-sans">
          <div>
            <p className="text-stone-500 uppercase tracking-widest mb-0.5">This week</p>
            <p className="text-amber-400 font-medium">${(stats.weekTotal / 100).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-stone-500 uppercase tracking-widest mb-0.5">This month</p>
            <p className="text-amber-400 font-medium">${(stats.monthTotal / 100).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-stone-500 uppercase tracking-widest mb-0.5">Active subs</p>
            <p className="text-amber-400 font-medium">{stats.activeSubscribers}</p>
          </div>
        </div>
      )}

      <div className="p-4 max-w-3xl mx-auto">

        {/* ── Shop Settings Panel ── */}
        {showSettings && settings && (
          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mt-4 mb-5">
            <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between">
              <p className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400">Shop Settings</p>
              {settingsSaving && <span className="text-xs text-stone-400">Saving…</span>}
            </div>

            <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-800 dark:text-stone-200 font-medium">Accepting Orders</p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Customers can place orders on the website</p>
              </div>
              <button
                onClick={() => saveSettings({ acceptingOrders: !settings.acceptingOrders })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.acceptingOrders ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.acceptingOrders ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-1.5">Batch Info</label>
                <input
                  type="text"
                  value={settings.batchInfo}
                  onChange={(e) => setSettings({ ...settings, batchInfo: e.target.value })}
                  onBlur={() => saveSettings({ batchInfo: settings.batchInfo })}
                  className="w-full border-b border-stone-200 dark:border-stone-600 py-1.5 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 bg-transparent"
                  placeholder="Next batch ready at 4pm today"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-1.5">Order Cutoff Time</label>
                <input
                  type="text"
                  value={settings.cutoffTime}
                  onChange={(e) => setSettings({ ...settings, cutoffTime: e.target.value })}
                  onBlur={() => saveSettings({ cutoffTime: settings.cutoffTime })}
                  className="w-full border-b border-stone-200 dark:border-stone-600 py-1.5 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 bg-transparent"
                  placeholder="2:00 PM"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-1.5">Available Spots Today</label>
                <input
                  type="number"
                  min={0}
                  value={settings.availableSpots}
                  onChange={(e) => setSettings({ ...settings, availableSpots: Number(e.target.value) })}
                  onBlur={() => saveSettings({ availableSpots: settings.availableSpots })}
                  className="w-full border-b border-stone-200 dark:border-stone-600 py-1.5 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-1.5">Pickup Instructions</label>
                <input
                  type="text"
                  value={settings.pickupInstructions}
                  onChange={(e) => setSettings({ ...settings, pickupInstructions: e.target.value })}
                  onBlur={() => saveSettings({ pickupInstructions: settings.pickupInstructions })}
                  className="w-full border-b border-stone-200 dark:border-stone-600 py-1.5 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 bg-transparent"
                  placeholder="Pickup 4–7pm…"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Summary pills ── */}
        {orders.length > 0 && (
          <div className="flex gap-2 mt-4 mb-4 flex-wrap">
            <span className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs px-3 py-1.5 text-stone-600 dark:text-stone-400">
              {orders.length} total orders
            </span>
            {weeklyDropCount > 0 && (
              <span className="bg-amber-50 border border-amber-200 text-xs px-3 py-1.5 text-amber-700">
                {weeklyDropCount} weekly drop interest
              </span>
            )}
            {eventOrderCount > 0 && (
              <span className="bg-purple-50 border border-purple-200 text-xs px-3 py-1.5 text-purple-700">
                {eventOrderCount} event order{eventOrderCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {loading && <p className="text-stone-500 text-center py-12 text-sm">Loading…</p>}

        {!loading && orders.length === 0 && (
          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-12 text-center mt-4">
            <p className="font-serif text-stone-500 dark:text-stone-400 text-xl">No orders yet</p>
          </div>
        )}

        {activeOrders.length > 0 && (
          <div className="mt-2">
            <p className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 mb-3">
              Active ({activeOrders.length})
            </p>
            <div className="space-y-3">
              {activeOrders.map((o) => (
                <OrderCard key={o.id} order={o} onStatusChange={updateStatus} />
              ))}
            </div>
          </div>
        )}

        {pastOrders.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-3">
              Past ({pastOrders.length})
            </p>
            <div className="space-y-3">
              {pastOrders.map((o) => (
                <OrderCard key={o.id} order={o} onStatusChange={updateStatus} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order
  onStatusChange: (id: string, status: OrderStatus) => void
}) {
  const next = NEXT_STATUS[order.status]

  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
      <div className="p-4 border-b border-stone-100 dark:border-stone-700 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-stone-900 dark:text-stone-100 text-base">{order.customerName}</span>
            <span className={`text-[10px] px-2 py-0.5 border tracking-widest uppercase font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
            {order.weeklyDrop && (
              <span className="text-[10px] px-2 py-0.5 border border-amber-200 bg-amber-50 text-amber-700 tracking-widest uppercase">
                Weekly
              </span>
            )}
            {order.isEventOrder && (
              <span className="text-[10px] px-2 py-0.5 border border-purple-200 bg-purple-50 text-purple-700 tracking-widest uppercase">
                Event
              </span>
            )}
          </div>
          <p className="text-stone-400 dark:text-stone-500 text-xs mt-0.5 font-mono">
            {order.id} · {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="font-serif text-stone-900 dark:text-stone-100 text-lg tabular-nums">${(order.total / 100).toFixed(2)}</p>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-stone-100 dark:border-stone-700">
        <div>
          <p className="tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">Method</p>
          <p className="text-stone-700 dark:text-stone-300 capitalize">{order.fulfillment}</p>
        </div>
        <div>
          <p className="tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">Order</p>
          <p className="text-stone-700 dark:text-stone-300">
            {order.items.map((item) => `${item.qty}× ${item.tierLabel}`).join(', ')} — {order.cookiesTotal} cookies
          </p>
        </div>
        <div>
          <p className="tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">Phone</p>
          <p className="text-stone-700 dark:text-stone-300">{order.phone}</p>
        </div>
        {order.referredBy && (
          <div>
            <p className="tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">Referred By</p>
            <p className="text-stone-700 dark:text-stone-300 font-mono text-[10px]">{order.referredBy}</p>
          </div>
        )}
        {order.fulfillment === 'delivery' && order.address && (
          <div className="col-span-2">
            <p className="tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">Address</p>
            <p className="text-stone-700 dark:text-stone-300">{order.address}, {order.city}</p>
          </div>
        )}
        {order.email && (
          <div className="col-span-2 sm:col-span-1">
            <p className="tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">Email</p>
            <p className="text-stone-700 dark:text-stone-300 truncate">{order.email}</p>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-700 border-b border-stone-100 dark:border-stone-600 text-xs text-stone-500 dark:text-stone-400">
          <span className="tracking-widest uppercase text-stone-400 dark:text-stone-500">Notes: </span>{order.notes}
        </div>
      )}

      <div className="p-3 flex items-center gap-2 flex-wrap">
        {next && (
          <button
            onClick={() => onStatusChange(order.id, next)}
            className="bg-stone-900 dark:bg-stone-100 hover:bg-stone-700 dark:hover:bg-stone-300 text-white dark:text-stone-900 text-[10px] tracking-widest uppercase px-3 py-2 transition-colors font-medium"
          >
            Mark {STATUS_LABELS[next]} →
          </button>
        )}
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
          className="text-xs border border-stone-200 dark:border-stone-600 px-2 py-1.5 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 focus:outline-none focus:border-stone-400 transition-colors"
        >
          {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
