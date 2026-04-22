'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { TIERS, TierId } from '@/lib/tiers'

const DELIVERY_FEE = 5

export default function CheckoutPage() {
  const { items, cartLines, hasItems, subtotal, setQty, clearCart } = useCart()
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', address: '', city: '', notes: '' })
  const [referredBy, setReferredBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tier = params.get('tier')
    if (tier && ['small','medium','large'].includes(tier)) setQty(tier as TierId, 1)
    const ref = params.get('ref')
    if (ref) setReferredBy(ref)
  }, [])

  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.customerName.trim()) errs.customerName = 'Name is required'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    if (!form.email.trim()) errs.email = 'Email is required (for receipt)'
    if (fulfillment === 'delivery') {
      if (!form.address.trim()) errs.address = 'Address is required'
      if (!form.city.trim()) errs.city = 'City is required'
    }
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasItems) return
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, fulfillment,
          items: cartLines.map((l) => ({ tierId: l.tier.id, qty: l.qty })),
          referredBy: referredBy || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      clearCart()
      window.location.href = data.url
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pt-12 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-text-muted text-xs font-sans tracking-widest uppercase hover:text-gold transition-colors">← Back</Link>
            <h1 className="font-serif text-4xl text-text-primary mt-6">Your Order</h1>
            <div className="gold-divider mt-4" />
          </div>

          {/* Item selector */}
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase text-text-muted font-sans mb-3">Select cookies</p>
            <div className="space-y-2">
              {TIERS.map((tier) => {
                const qty = items[tier.id as TierId] ?? 0
                return (
                  <div key={tier.id} className={`flex items-center justify-between border px-4 py-4 transition-colors ${qty > 0 ? 'border-gold' : 'border-white/10'}`}>
                    <div>
                      <p className="font-serif text-text-primary">{tier.label}</p>
                      <p className="text-text-muted text-xs font-sans mt-0.5">${tier.price}.00 per pack</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQty(tier.id as TierId, qty - 1)}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-text-muted hover:border-gold hover:text-gold transition-colors">−</button>
                      <span className="font-serif text-lg text-text-primary w-5 text-center">{qty}</span>
                      <button type="button" onClick={() => setQty(tier.id as TierId, qty + 1)}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-text-muted hover:border-gold hover:text-gold transition-colors">+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fulfillment */}
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-3 font-sans">Delivery method</p>
              <div className="grid grid-cols-2 gap-3">
                {(['pickup','delivery'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => setFulfillment(opt)}
                    className={`py-4 px-5 border text-xs tracking-widest uppercase font-sans transition-colors text-left ${
                      fulfillment === opt ? 'border-gold text-gold' : 'border-white/10 text-text-muted hover:border-white/20'
                    }`}>
                    <span className="block font-medium capitalize">{opt}</span>
                    <span className="block mt-0.5 text-[10px] opacity-60">{opt === 'pickup' ? 'Free · 4–7pm' : '+$5.00'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer info */}
            <div className="space-y-5">
              <p className="text-xs tracking-widest uppercase text-text-muted font-sans">Your info</p>
              {[
                { key: 'customerName', label: 'Full name', type: 'text' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'email', label: 'Email (for receipt)', type: 'email' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">{label} <span className="text-gold">*</span></label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border-b border-white/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
              {fulfillment === 'delivery' && (
                <>
                  {[{ key: 'address', label: 'Street address' }, { key: 'city', label: 'City' }].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">{label} <span className="text-gold">*</span></label>
                      <input type="text" value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border-b border-white/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
                      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </>
              )}
              <div>
                <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors resize-none" rows={2} />
              </div>
            </div>

            {/* Order summary */}
            <div className="border border-white/10 p-6 space-y-2.5">
              {cartLines.map((line) => (
                <div key={line.tier.id} className="flex justify-between text-sm font-sans">
                  <span className="text-text-muted">{line.qty} × {line.tier.label}</span>
                  <span className="text-text-primary">${line.tier.price * line.qty}.00</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-text-muted font-sans">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee}.00`}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                <span className="text-xs tracking-widest uppercase text-text-muted font-sans">Total</span>
                <span className="font-serif text-text-primary text-2xl">${total}.00</span>
              </div>
            </div>

            <button type="submit" disabled={loading || !hasItems}
              className="w-full bg-gold hover:bg-gold-warm disabled:opacity-40 text-bg text-xs tracking-widest uppercase font-sans font-medium py-5 transition-colors">
              {loading ? 'Redirecting to payment…' : 'Pay with Card →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
