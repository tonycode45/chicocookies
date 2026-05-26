'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { TierId, Tier, TIERS } from '@/lib/tiers'

export type CartItems = Partial<Record<TierId, number>>

interface CartLine {
  tier: Tier
  qty: number
}

interface CartContextType {
  items: CartItems
  cartLines: CartLine[]
  hasItems: boolean
  totalPacks: number
  subtotal: number
  setQty: (id: TierId, qty: number) => void
  addTier: (id: TierId) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const MAX_QTY = 99

function sanitizeItems(raw: unknown): CartItems {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const validIds = new Set<string>(TIERS.map((t) => t.id))
  const result: CartItems = {}
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!validIds.has(key)) continue
    const n = Number(val)
    if (!Number.isFinite(n) || n <= 0) continue
    result[key as TierId] = Math.min(Math.floor(n), MAX_QTY)
  }
  return result
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chicoine-cart-v2')
      if (saved) setItems(sanitizeItems(JSON.parse(saved)))
    } catch {}
  }, [])

  const save = useCallback((next: CartItems) => {
    setItems(next)
    try {
      localStorage.setItem('chicoine-cart-v2', JSON.stringify(next))
    } catch {}
  }, [])

  const setQty = useCallback((id: TierId, qty: number) => {
    const clamped = Math.floor(qty)
    setItems((prev) => {
      const next = { ...prev }
      if (clamped <= 0) {
        delete next[id]
      } else {
        next[id] = Math.min(clamped, MAX_QTY)
      }
      try {
        localStorage.setItem('chicoine-cart-v2', JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const addTier = useCallback((id: TierId) => {
    setItems((prev) => {
      const next = { ...prev, [id]: Math.min((prev[id] ?? 0) + 1, MAX_QTY) }
      try {
        localStorage.setItem('chicoine-cart-v2', JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems({})
    try {
      localStorage.removeItem('chicoine-cart-v2')
    } catch {}
  }, [])

  const cartLines: CartLine[] = TIERS.flatMap((tier) => {
    const qty = items[tier.id as TierId] ?? 0
    return qty > 0 ? [{ tier, qty }] : []
  })

  const hasItems = cartLines.length > 0
  const totalPacks = cartLines.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = cartLines.reduce((sum, l) => sum + l.tier.price * l.qty, 0)

  return (
    <CartContext.Provider value={{ items, cartLines, hasItems, totalPacks, subtotal, setQty, addTier, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
