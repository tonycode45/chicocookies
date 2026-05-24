import { getOrderById } from '@/lib/db/orders'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed — Chicoine Cookies',
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const totalDisplay = `$${(order.total / 100).toFixed(2)}`

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-xs tracking-widest uppercase text-gold mb-6 font-sans">Order Confirmed</p>
        <h1 className="font-serif text-4xl text-text-primary mb-3">Your cookies are being baked.</h1>
        <p className="text-text-muted font-sans text-sm mb-10">A receipt has been sent to {order.email}.</p>

        <div className="border border-white/10 p-6 text-left space-y-3 mb-10">
          <div className="flex justify-between text-sm font-sans">
            <span className="text-text-muted">Order ID</span>
            <span className="text-text-primary font-mono text-xs">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm font-sans">
            <span className="text-text-muted">Fulfillment</span>
            <span className="text-text-primary capitalize">{order.fulfillment}</span>
          </div>
          <div className="flex justify-between text-sm font-sans">
            <span className="text-text-muted">Cookies</span>
            <span className="text-text-primary">{order.cookiesTotal}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="text-xs tracking-widest uppercase text-text-muted font-sans">Total</span>
            <span className="font-serif text-text-primary text-xl">{totalDisplay}</span>
          </div>
        </div>

        <p className="text-text-muted text-xs font-sans mb-8">
          {order.fulfillment === 'pickup'
            ? "Pickup available 4\u20137pm. We\u2019ll confirm the address by text."
            : "We\u2019ll text you before delivery."}
        </p>

        <Link href="/" aria-label="Back to shop — return to the Chicoine Cookies home page" className="inline-block border border-white/10 text-text-muted hover:border-gold hover:text-gold text-xs tracking-widest uppercase font-sans px-8 py-4 transition-colors">
          Back to shop
        </Link>
      </div>
    </div>
  )
}
