'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Order } from '@/lib/db/orders'

const STATUS_LABELS: Record<string, string> = {
  new: 'Received',
  confirmed: 'Confirmed',
  baking: 'Baking',
  ready: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  completed: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrdersPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/by-email?email=${encodeURIComponent(email.trim())}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data)
      if (data.length === 0) setError('No orders found for that email address.')
    } catch {
      setError('Could not look up orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-text-muted text-xs font-sans tracking-widest uppercase hover:text-gold transition-colors">← Back</Link>
          <p className="text-xs tracking-widest uppercase text-gold mt-6 mb-3 font-sans">Order History</p>
          <h1 className="font-serif text-4xl text-text-primary">My Orders</h1>
          <div className="gold-divider mt-4" />
        </div>

        <form onSubmit={handleLookup} className="space-y-5 mb-10">
          <div>
            <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border-b border-white/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full border border-gold text-gold hover:bg-gold hover:text-bg disabled:opacity-40 text-xs tracking-widest uppercase font-sans font-medium py-4 transition-colors">
            {loading ? 'Looking up…' : 'Look up orders →'}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm font-sans mb-6">{error}</p>}

        {orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-white/10 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-text-muted text-xs">{order.id}</p>
                    <p className="text-text-dim text-xs font-sans mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <p className="font-serif text-text-primary text-lg">${(order.total / 100).toFixed(2)}</p>
                </div>
                <div className="text-xs font-sans text-text-muted space-y-1">
                  <p>{order.items.map((i) => `${i.qty}× ${i.tierLabel}`).join(', ')} — {order.cookiesTotal} cookies</p>
                  <p className="capitalize">{order.fulfillment}</p>
                </div>
                <span className="inline-block border border-gold/30 text-gold text-[10px] tracking-widest uppercase px-2 py-0.5 font-sans">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
