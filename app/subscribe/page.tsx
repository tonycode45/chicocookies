'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TIERS } from '@/lib/tiers'

const SUB_PRICES: Record<string, number> = { small: 5, medium: 13, large: 21 }

export default function SubscribePage() {
  const [mode, setMode] = useState<'subscribe' | 'manage'>('subscribe')
  const [selectedTier, setSelectedTier] = useState('medium')
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [form, setForm] = useState({ customerName: '', phone: '', email: '' })
  const [manageEmail, setManageEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === '1') {
      setMode('manage')
      const email = params.get('email')
      if (email) setManageEmail(decodeURIComponent(email))
    }
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.customerName.trim()) { setError('Name and email are required'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId: selectedTier, fulfillment, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleManage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manageEmail.trim()) { setError('Email is required'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manageEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No subscription found')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No active subscription found for that email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-text-muted text-xs font-sans tracking-widest uppercase hover:text-gold transition-colors">← Back</Link>
          <p className="text-xs tracking-widest uppercase text-gold mt-6 mb-3 font-sans">Weekly Subscription</p>
          <h1 className="font-serif text-4xl text-text-primary">Fresh cookies, every week.</h1>
          <div className="gold-divider mt-4" />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 border border-white/10 p-1 mb-8">
          {(['subscribe','manage'] as const).map((tab) => (
            <button key={tab} onClick={() => { setMode(tab); setError('') }}
              className={`flex-1 py-2 text-xs tracking-widest uppercase font-sans transition-colors capitalize ${
                mode === tab ? 'bg-gold text-bg' : 'text-text-muted hover:text-text-primary'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {mode === 'subscribe' && (
          <form onSubmit={handleSubscribe} className="space-y-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-3 font-sans">Choose your size</p>
              <div className="space-y-2">
                {TIERS.map((tier) => (
                  <button key={tier.id} type="button" onClick={() => setSelectedTier(tier.id)}
                    className={`w-full flex items-center justify-between border px-4 py-4 transition-colors text-left ${
                      selectedTier === tier.id ? 'border-gold' : 'border-white/10 hover:border-white/20'
                    }`}>
                    <div>
                      <p className="font-serif text-text-primary">{tier.label}</p>
                      <p className="text-text-muted text-xs font-sans mt-0.5">Every week</p>
                    </div>
                    <p className="font-serif text-text-primary text-lg">${SUB_PRICES[tier.id]}/wk</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest uppercase text-text-muted mb-3 font-sans">Delivery method</p>
              <div className="grid grid-cols-2 gap-2">
                {(['pickup','delivery'] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => setFulfillment(opt)}
                    className={`py-3 border text-xs tracking-widest uppercase font-sans transition-colors capitalize ${
                      fulfillment === opt ? 'border-gold text-gold' : 'border-white/10 text-text-muted'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[{ key: 'customerName', label: 'Full name', type: 'text' }, { key: 'phone', label: 'Phone', type: 'tel' }, { key: 'email', label: 'Email', type: 'email' }].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">{label}</label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border-b border-white/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm font-sans">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-gold hover:bg-gold-warm disabled:opacity-40 text-bg text-xs tracking-widest uppercase font-sans font-medium py-5 transition-colors">
              {loading ? 'Redirecting…' : `Subscribe — $${SUB_PRICES[selectedTier]}/week →`}
            </button>
          </form>
        )}

        {mode === 'manage' && (
          <form onSubmit={handleManage} className="space-y-6">
            <p className="text-text-muted text-sm font-sans leading-relaxed">
              Enter your email to open the subscription portal — pause, skip a week, or cancel.
            </p>
            <div>
              <label className="block text-xs tracking-widest uppercase text-text-muted mb-2 font-sans">Email</label>
              <input type="email" value={manageEmail} onChange={(e) => setManageEmail(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-3 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
            {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full border border-gold text-gold hover:bg-gold hover:text-bg disabled:opacity-40 text-xs tracking-widest uppercase font-sans font-medium py-5 transition-colors">
              {loading ? 'Looking up…' : 'Open Subscription Portal →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
