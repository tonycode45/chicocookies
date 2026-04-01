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

interface Order {
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

// Quick status flow for one-tap mobile updates
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
      setOrders(await ordersRes.json())
      setSettings(await settingsRes.json())
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
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': savedPassword! },
        body: JSON.stringify({ status }),
      })
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
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-serif text-2xl text-stone-900 tracking-wide mb-1">Chicoine Cookies</p>
            <p className="text-xs tracking-widest uppercase text-stone-400 font-sans">Admin Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2 font-sans">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-stone-300 py-2.5 text-stone-900 placeholder-stone-300 text-sm focus:outline-none focus:border-stone-700 transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-700 disabled:opacity-50 text-white text-xs tracking-widest uppercase font-sans font-medium py-3.5 transition-colors mt-2"
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
    <div className="min-h-screen bg-stone-100 font-sans">
      {/* Header */}
      <div className="bg-stone-950 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif text-cream-DEFAULT">Chicoine</span>
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

      <div className="p-4 max-w-3xl mx-auto">

        {/* ── Shop Settings Panel ── */}
        {showSettings && settings && (
          <div className="bg-white border border-stone-200 mt-4 mb-5">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <p className="text-xs tracking-widest uppercase text-stone-500">Shop Settings</p>
              {settingsSaving && <span className="text-xs text-stone-400">Saving…</span>}
            </div>

            {/* Accept / Pause toggle */}
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-800 font-medium">Accepting Orders</p>
                <p className="text-xs text-stone-400 mt-0.5">Customers can place orders on the website</p>
              </div>
              <button
                onClick={() => saveSettings({ acceptingOrders: !settings.acceptingOrders })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.acceptingOrders ? 'bg-green-500' : 'bg-stone-300'
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
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">Batch Info</label>
                <input
                  type="text"
                  value={settings.batchInfo}
                  onChange={(e) => setSettings({ ...settings, batchInfo: e.target.value })}
                  onBlur={() => saveSettings({ batchInfo: settings.batchInfo })}
                  className="w-full border-b border-stone-200 py-1.5 text-sm text-stone-800 focus:outline-none focus:border-stone-600 bg-transparent"
                  placeholder="Next batch ready at 4pm today"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">Order Cutoff Time</label>
                <input
                  type="text"
                  value={settings.cutoffTime}
                  onChange={(e) => setSettings({ ...settings, cutoffTime: e.target.value })}
                  onBlur={() => saveSettings({ cutoffTime: settings.cutoffTime })}
                  className="w-full border-b border-stone-200 py-1.5 text-sm text-stone-800 focus:outline-none focus:border-stone-600 bg-transparent"
                  placeholder="2:00 PM"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">Available Spots Today</label>
                <input
                  type="number"
                  min={0}
                  value={settings.availableSpots}
                  onChange={(e) => setSettings({ ...settings, availableSpots: Number(e.target.value) })}
                  onBlur={() => saveSettings({ availableSpots: settings.availableSpots })}
                  className="w-full border-b border-stone-200 py-1.5 text-sm text-stone-800 focus:outline-none focus:border-stone-600 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">Pickup Instructions</label>
                <input
                  type="text"
                  value={settings.pickupInstructions}
                  onChange={(e) => setSettings({ ...settings, pickupInstructions: e.target.value })}
                  onBlur={() => saveSettings({ pickupInstructions: settings.pickupInstructions })}
                  className="w-full border-b border-stone-200 py-1.5 text-sm text-stone-800 focus:outline-none focus:border-stone-600 bg-transparent"
                  placeholder="Pickup 4–7pm…"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Summary pills ── */}
        {orders.length > 0 && (
          <div className="flex gap-2 mt-4 mb-4 flex-wrap">
            <span className="bg-white border border-stone-200 text-xs px-3 py-1.5 text-stone-600">
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
          <div className="bg-white border border-stone-200 p-12 text-center mt-4">
            <p className="font-serif text-stone-500 text-xl">No orders yet</p>
          </div>
        )}

        {/* Active orders */}
        {activeOrders.length > 0 && (
          <div className="mt-2">
            <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">
              Active ({activeOrders.length})
            </p>
            <div className="space-y-3">
              {activeOrders.map((o) => (
                <OrderCard key={o.id} order={o} onStatusChange={updateStatus} />
              ))}
            </div>
          </div>
        )}

        {/* Past orders */}
        {pastOrders.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
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
    <div className="bg-white border border-stone-200">
      {/* Top row */}
      <div className="p-4 border-b border-stone-100 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-stone-900 text-base">{order.customerName}</span>
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
          <p className="text-stone-400 text-xs mt-0.5 font-mono">
            {order.id} · {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="font-serif text-stone-900 text-lg tabular-nums">${order.total}.00</p>
      </div>

      {/* Details */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-stone-100">
        <div>
          <p className="tracking-widest uppercase text-stone-400 mb-0.5">Method</p>
          <p className="text-stone-700 capitalize">{order.fulfillment}</p>
        </div>
        <div>
          <p className="tracking-widest uppercase text-stone-400 mb-0.5">Order</p>
          <p className="text-stone-700">{order.tierLabel} × {order.packs} — {order.cookiesTotal} cookies</p>
        </div>
        <div>
          <p className="tracking-widest uppercase text-stone-400 mb-0.5">Phone</p>
          <p className="text-stone-700">{order.phone}</p>
        </div>
        {order.referredBy && (
          <div>
            <p className="tracking-widest uppercase text-stone-400 mb-0.5">Referred By</p>
            <p className="text-stone-700 font-mono text-[10px]">{order.referredBy}</p>
          </div>
        )}
        {order.fulfillment === 'delivery' && order.address && (
          <div className="col-span-2">
            <p className="tracking-widest uppercase text-stone-400 mb-0.5">Address</p>
            <p className="text-stone-700">{order.address}, {order.city}</p>
          </div>
        )}
        {order.email && (
          <div className="col-span-2 sm:col-span-1">
            <p className="tracking-widest uppercase text-stone-400 mb-0.5">Email</p>
            <p className="text-stone-700 truncate">{order.email}</p>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100 text-xs text-stone-500">
          <span className="tracking-widest uppercase text-stone-400">Notes: </span>{order.notes}
        </div>
      )}

      {/* Status controls */}
      <div className="p-3 flex items-center gap-2 flex-wrap">
        {/* One-tap advance button */}
        {next && (
          <button
            onClick={() => onStatusChange(order.id, next)}
            className="bg-stone-900 hover:bg-stone-700 text-white text-[10px] tracking-widest uppercase px-3 py-2 transition-colors font-medium"
          >
            Mark {STATUS_LABELS[next]} →
          </button>
        )}

        {/* Full dropdown */}
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
          className="text-xs border border-stone-200 px-2 py-1.5 text-stone-700 bg-white focus:outline-none focus:border-stone-400 transition-colors"
        >
          {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
