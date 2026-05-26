'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { TIERS, TierId } from '@/lib/tiers'
import { useLanguage } from '@/context/LanguageContext'
import { translations } from '@/lib/translations'

type FeeStatus = 'idle' | 'loading' | 'ok' | 'error'

const DELIVERY_MINIMUM = 30

export default function CheckoutPage() {
  const { items, cartLines, hasItems, subtotal, setQty, clearCart } = useCart()
  const { lang } = useLanguage()
  const t = translations[lang]
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', address: '', city: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [feeStatus, setFeeStatus] = useState<FeeStatus>('idle')
  const [feeCents, setFeeCents] = useState<number>(0)
  const [feeError, setFeeError] = useState<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tier = params.get('tier')
    if (tier && ['small','medium','large'].includes(tier)) setQty(tier as TierId, 1)
  }, [setQty])

  const checkDeliveryFee = useCallback(async (address: string, city: string) => {
    if (!address.trim() || !city.trim()) {
      setFeeStatus('idle')
      return
    }
    setFeeStatus('loading')
    try {
      const res = await fetch('/api/delivery-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, city }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFeeStatus('error')
        setFeeError(data.error || 'Could not calculate delivery fee.')
      } else {
        setFeeStatus('ok')
        setFeeCents(data.feeCents)
      }
    } catch {
      setFeeStatus('error')
      setFeeError('Could not calculate delivery fee.')
    }
  }, [])

  // Debounce fee check when address or city changes while delivery is selected
  useEffect(() => {
    if (fulfillment !== 'delivery') return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setFeeStatus('idle')
    if (subtotal < DELIVERY_MINIMUM) return
    if (form.address.trim() && form.city.trim()) {
      debounceRef.current = setTimeout(() => checkDeliveryFee(form.address, form.city), 700)
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [form.address, form.city, fulfillment, subtotal, checkDeliveryFee])

  // Reset fee state when switching fulfillment
  useEffect(() => {
    setFeeStatus('idle')
    setFeeCents(0)
    setFeeError('')
  }, [fulfillment])

  const deliveryFeeDollars = fulfillment === 'delivery' && feeStatus === 'ok' ? feeCents / 100 : 0
  const total = subtotal + deliveryFeeDollars
  const belowDeliveryMinimum = fulfillment === 'delivery' && hasItems && subtotal < DELIVERY_MINIMUM

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.customerName.trim()) errs.customerName = t.checkout.errors.nameRequired
    if (!form.phone.trim()) errs.phone = t.checkout.errors.phoneRequired
    if (fulfillment === 'delivery') {
      if (!form.address.trim()) errs.address = t.checkout.errors.addressRequired
      if (!form.city.trim()) errs.city = t.checkout.errors.cityRequired
    }
    return errs
  }

  const deliveryBlocked = fulfillment === 'delivery' && (belowDeliveryMinimum || feeStatus !== 'ok')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasItems) return
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (deliveryBlocked) return
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, fulfillment,
          items: cartLines.map((l) => ({ tierId: l.tier.id, qty: l.qty })),
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
            <h1 className="font-serif text-4xl text-text-primary mt-6">{t.checkout.badge}</h1>
            <div className="gold-divider mt-4" />
          </div>

          {/* Item selector */}
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase text-text-muted font-sans mb-3">{t.checkout.selectItems}</p>
            <div className="space-y-2">
              {TIERS.map((tier) => {
                const qty = items[tier.id as TierId] ?? 0
                return (
                  <div key={tier.id} className={`flex items-center justify-between border px-4 py-4 transition-colors ${qty > 0 ? 'border-gold' : 'border-text-primary/10'}`}>
                    <div>
                      <p className="font-serif text-text-primary">{tier.label}</p>
                      <p className="text-text-muted text-xs font-sans mt-0.5">${tier.price}.00 {t.checkout.perPack}</p>
                      {tier.id in t.home.order.savings && (
                        <p className="text-gold text-[10px] font-sans tracking-widest uppercase mt-0.5">
                          {t.home.order.savings[tier.id as keyof typeof t.home.order.savings]}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQty(tier.id as TierId, qty - 1)}
                        className="w-10 h-10 border border-text-primary/10 flex items-center justify-center text-text-muted hover:border-gold hover:text-gold transition-colors">−</button>
                      <span className="font-serif text-lg text-text-primary w-5 text-center">{qty}</span>
                      <button type="button" onClick={() => setQty(tier.id as TierId, qty + 1)}
                        className="w-10 h-10 border border-text-primary/10 flex items-center justify-center text-text-muted hover:border-gold hover:text-gold transition-colors">+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fulfillment */}
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-3 font-sans">{t.checkout.fulfillmentMethod}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['pickup','delivery'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => setFulfillment(opt)}
                    className={`py-4 px-5 border text-xs tracking-widest uppercase font-sans transition-colors text-left ${
                      fulfillment === opt ? 'border-gold text-gold' : 'border-text-primary/10 text-text-muted hover:border-white/20'
                    }`}>
                    <span className="block font-medium">{t.checkout[opt].label}</span>
                    <span className="block mt-0.5 text-[10px] opacity-60">{t.checkout[opt].sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer info */}
            <div className="space-y-5">
              <p className="text-xs tracking-widest uppercase text-text-muted font-sans">{t.checkout.yourInfo}</p>
              {[
                { key: 'customerName', label: t.checkout.fields.fullName, type: 'text' },
                { key: 'phone', label: t.checkout.fields.phone, type: 'tel' },
                { key: 'email', label: t.checkout.fields.email, type: 'email' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">{label} <span className="text-gold">*</span></label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border-b border-text-primary/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
              {fulfillment === 'delivery' && (
                <>
                  {[{ key: 'address', label: t.checkout.fields.address }, { key: 'city', label: t.checkout.fields.city }].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">{label} <span className="text-gold">*</span></label>
                      <input type="text" value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border-b border-text-primary/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
                      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </>
              )}
              <div>
                <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">{t.checkout.fields.notes}</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border-b border-text-primary/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors resize-none" rows={2} />
              </div>
            </div>

            {/* Order summary */}
            <div className="border border-text-primary/10 p-6 space-y-2.5">
              {cartLines.map((line) => (
                <div key={line.tier.id} className="flex justify-between text-sm font-sans">
                  <span className="text-text-muted">{line.qty} × {line.tier.label}</span>
                  <span className="text-text-primary">${line.tier.price * line.qty}.00</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-text-muted font-sans">
                <span>{t.checkout.summary.delivery}</span>
                <span>
                  {fulfillment === 'pickup' && t.checkout.summary.complimentary}
                  {fulfillment === 'delivery' && feeStatus === 'idle' && '—'}
                  {fulfillment === 'delivery' && feeStatus === 'loading' && 'Calculating…'}
                  {fulfillment === 'delivery' && feeStatus === 'ok' && `$${(feeCents / 100).toFixed(2)}`}
                  {fulfillment === 'delivery' && feeStatus === 'error' && (
                    <span className="text-red-400">Unavailable</span>
                  )}
                </span>
              </div>
              {fulfillment === 'delivery' && feeStatus === 'error' && (
                <p className="text-red-400 text-xs leading-snug">{feeError}</p>
              )}
              {belowDeliveryMinimum && (
                <p className="text-red-400 text-xs leading-snug">{t.checkout.errors.deliveryMinimum}</p>
              )}
              <div className="border-t border-text-primary/10 pt-3 flex justify-between items-baseline">
                <span className="text-xs tracking-widest uppercase text-text-muted font-sans">{t.checkout.summary.total}</span>
                <span className="font-serif text-text-primary text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" disabled={loading || !hasItems || deliveryBlocked}
              className="w-full bg-gold hover:bg-gold-warm disabled:opacity-40 text-bg text-xs tracking-widest uppercase font-sans font-medium py-5 transition-colors">
              {loading ? t.checkout.submitting : t.checkout.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
