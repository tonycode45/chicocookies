'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TierId, Tier, TIERS, getTierById } from '@/lib/tiers'

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chicoine-cart-v2')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  const save = (next: CartItems) => {
    setItems(next)
    try {
      localStorage.setItem('chicoine-cart-v2', JSON.stringify(next))
    } catch {}
  }

  const setQty = (id: TierId, qty: number) => {
    const next = { ...items }
    if (qty <= 0) {
      delete next[id]
    } else {
      next[id] = qty
    }
    save(next)
  }

  const addTier = (id: TierId) => {
    save({ ...items, [id]: (items[id] ?? 0) + 1 })
  }

  const clearCart = () => {
    setItems({})
    try {
      localStorage.removeItem('chicoine-cart-v2')
    } catch {}
  }

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
