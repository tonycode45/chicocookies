'use client'

import { useEffect, useState } from 'react'
import type { OrderStatus } from '@/lib/db/orders'

type Step = { status: OrderStatus; label: string }

const DELIVERY_STEPS: Step[] = [
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'baking', label: 'Baking' },
  { status: 'ready', label: 'Ready' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'completed', label: 'Delivered' },
]

const PICKUP_STEPS: Step[] = [
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'baking', label: 'Baking' },
  { status: 'ready', label: 'Ready for Pickup' },
  { status: 'completed', label: 'Picked Up' },
]

export default function OrderStatusTimeline({
  orderId,
  initialStatus,
  fulfillment,
}: {
  orderId: string
  initialStatus: OrderStatus
  fulfillment: 'pickup' | 'delivery'
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus)

  useEffect(() => {
    let active = true
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (active && data.status) setStatus(data.status as OrderStatus)
      } catch {
        // transient network errors are ignored; next tick retries
      }
    }
    const interval = setInterval(poll, 30000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [orderId])

  if (status === 'cancelled') {
    return (
      <div className="border border-red-400/30 bg-red-400/5 p-6 text-left mb-10">
        <p className="text-xs tracking-widest uppercase text-red-400 font-sans mb-2">Order Cancelled</p>
        <p className="text-text-muted text-sm font-sans">
          This order has been cancelled. If this is unexpected, please reach out and we&apos;ll make it right.
        </p>
      </div>
    )
  }

  const steps = fulfillment === 'delivery' ? DELIVERY_STEPS : PICKUP_STEPS
  const currentIndex = steps.findIndex((s) => s.status === status)

  return (
    <div className="border border-white/10 p-6 text-left mb-10">
      <p className="text-xs tracking-widest uppercase text-text-muted font-sans mb-5">Order Status</p>
      <ol>
        {steps.map((step, i) => {
          const done = currentIndex >= 0 && i <= currentIndex
          const current = i === currentIndex
          const notLast = i < steps.length - 1
          return (
            <li key={step.status} className="relative flex items-center gap-4 pb-6 last:pb-0">
              {notLast && (
                <span
                  aria-hidden
                  className={`absolute left-[5px] top-3 h-full w-px ${i < currentIndex ? 'bg-gold' : 'bg-white/10'}`}
                />
              )}
              <span
                className={`relative z-10 w-[11px] h-[11px] rounded-full border ${
                  done ? 'bg-gold border-gold' : 'bg-bg border-white/25'
                }`}
              />
              <span
                className={`text-sm font-sans ${
                  current ? 'text-gold' : done ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
      {currentIndex < 0 && (
        <p className="text-text-muted text-xs font-sans mt-1">Confirming your order…</p>
      )}
      <p className="text-text-muted text-[10px] font-sans mt-3 tracking-widest uppercase">Updates automatically</p>
    </div>
  )
}
