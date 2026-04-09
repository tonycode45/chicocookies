'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { TIERS, TierId } from '@/lib/tiers'

const DELIVERY_FEE = 5

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 mb-2 font-sans">
        {label} {required && <span className="text-gold normal-case tracking-normal">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full border-b border-stone-300 dark:border-stone-600 bg-transparent py-3 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 text-sm focus:outline-none focus:border-stone-900 dark:focus:border-stone-400 transition-colors'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, cartLines, hasItems, subtotal, setQty, clearCart } = useCart()
  const { t } = useLanguage()
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  })
  const [weeklyDrop, setWeeklyDrop] = useState(false)
  const [isEventOrder, setIsEventOrder] = useState(false)
  const [referredBy, setReferredBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) setReferredBy(ref)
  }, [])

  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasItems) return
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fulfillment,
          items: cartLines.map((l) => ({ tierId: l.tier.id, qty: l.qty })),
          weeklyDrop,
          isEventOrder,
          referredBy: referredBy || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Order failed')
      }
      const order = await res.json()
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-stone-950">
      <Header />
      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">

          {/* Page title */}
          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase text-gold mb-3 font-sans">{t.checkout.badge}</p>
            <h1 className="font-serif text-4xl text-stone-900 dark:text-stone-100">{t.checkout.headline}</h1>
            <div className="gold-divider mt-4" />
          </div>

          {/* Item selector */}
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-sans mb-3">{t.checkout.selectItems}</p>
            <div className="space-y-2">
              {TIERS.map((tier) => {
                const qty = items[tier.id as TierId] ?? 0
                return (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between border px-4 sm:px-5 py-4 transition-colors ${
                      qty > 0
                        ? 'border-gold bg-amber-50/20 dark:bg-amber-950/20'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900'
                    }`}
                  >
                    <div>
                      <p className="font-serif text-stone-900 dark:text-stone-100 text-base">{tier.label}</p>
                      <p className="text-stone-400 dark:text-stone-500 text-xs font-sans mt-0.5">
                        ${tier.price}.00 {t.checkout.perPack}
                        {tier.popular && <span className="ml-2 text-gold">{t.checkout.popular}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQty(tier.id as TierId, qty - 1)}
                        className="w-10 h-10 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 transition-colors text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="font-serif text-lg text-stone-900 dark:text-stone-100 w-5 text-center tabular-nums">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(tier.id as TierId, qty + 1)}
                        className="w-10 h-10 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 transition-colors text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Fulfillment */}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 mb-4 font-sans">{t.checkout.fulfillmentMethod}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['pickup', 'delivery'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFulfillment(opt)}
                    className={`py-4 px-4 sm:px-5 border text-xs tracking-widest uppercase font-sans transition-colors text-left ${
                      fulfillment === opt
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-stone-600 dark:hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-medium">{t.checkout[opt].label}</span>
                    <span className="block mt-0.5 text-[10px] opacity-60">{t.checkout[opt].sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer info */}
            <div className="space-y-6">
              <p className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans">{t.checkout.yourInfo}</p>

              <Field label={t.checkout.fields.fullName} required error={errors.customerName}>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className={inputClass}
                  placeholder={t.checkout.fields.fullNamePlaceholder}
                />
              </Field>

              <Field label={t.checkout.fields.phone} required error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  placeholder={t.checkout.fields.phonePlaceholder}
                />
              </Field>

              <Field label={t.checkout.fields.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder={t.checkout.fields.emailPlaceholder}
                />
              </Field>

              {fulfillment === 'delivery' && (
                <>
                  <Field label={t.checkout.fields.address} required error={errors.address}>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={inputClass}
                      placeholder={t.checkout.fields.addressPlaceholder}
                    />
                  </Field>
                  <Field label={t.checkout.fields.city} required error={errors.city}>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass}
                      placeholder={t.checkout.fields.cityPlaceholder}
                    />
                  </Field>
                </>
              )}

              <Field label={t.checkout.fields.notes}>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder={t.checkout.fields.notesPlaceholder}
                  rows={2}
                />
              </Field>
            </div>

            {/* Options */}
            <div className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800">
              <div className="p-5">
                <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-sans mb-4">{t.checkout.options}</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={weeklyDrop} onChange={(e) => setWeeklyDrop(e.target.checked)} className="mt-0.5 accent-stone-900 dark:accent-stone-100 w-5 h-5" />
                  <div>
                    <p className="text-stone-800 dark:text-stone-200 text-sm font-sans">{t.checkout.weeklyDrop.label}</p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-0.5">{t.checkout.weeklyDrop.desc}</p>
                  </div>
                </label>
              </div>
              <div className="p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={isEventOrder} onChange={(e) => setIsEventOrder(e.target.checked)} className="mt-0.5 accent-stone-900 dark:accent-stone-100 w-5 h-5" />
                  <div>
                    <p className="text-stone-800 dark:text-stone-200 text-sm font-sans">{t.checkout.eventOrder.label}</p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-0.5">{t.checkout.eventOrder.desc}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order summary */}
            <div className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
              <div className="p-6 space-y-2.5">
                {cartLines.map((line) => (
                  <div key={line.tier.id} className="flex justify-between text-sm font-sans">
                    <span className="text-stone-500 dark:text-stone-400">
                      {line.qty} × {line.tier.label}
                      <span className="text-stone-400 dark:text-stone-600 text-xs ml-1.5">(${line.tier.price}/{t.checkout.perPack})</span>
                    </span>
                    <span className="text-stone-700 dark:text-stone-300 tabular-nums">${line.tier.price * line.qty}.00</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400 font-sans pt-1">
                  <span>{t.checkout.summary.delivery}</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? t.checkout.summary.complimentary : `$${deliveryFee}.00`}
                  </span>
                </div>

                <div className="border-t border-stone-200 dark:border-stone-700 pt-3 flex justify-between items-baseline">
                  <span className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans">{t.checkout.summary.total}</span>
                  <span className="font-serif text-stone-900 dark:text-stone-100 text-2xl tabular-nums">${total}.00</span>
                </div>
              </div>
              <div className="px-6 pb-4">
                <p className="text-xs text-stone-400 dark:text-stone-500 font-sans">
                  {fulfillment === 'pickup' ? t.checkout.summary.paymentPickup : t.checkout.summary.paymentDelivery}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !hasItems}
              className="w-full bg-stone-900 dark:bg-stone-100 hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-50 text-white dark:text-stone-900 text-xs tracking-widest uppercase font-sans font-medium py-5 transition-colors"
            >
              {loading ? t.checkout.submitting : t.checkout.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
