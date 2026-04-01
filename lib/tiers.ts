export type TierId = 'small' | 'medium' | 'large'

export interface Tier {
  id: TierId
  cookies: number
  price: number
  label: string
  popular?: boolean
  savings?: string
}

export const TIERS: Tier[] = [
  {
    id: 'small',
    cookies: 2,
    price: 5,
    label: '2 Cookies',
  },
  {
    id: 'medium',
    cookies: 6,
    price: 14,
    label: '6 Cookies',
    popular: true,
    savings: 'Better value',
  },
  {
    id: 'large',
    cookies: 12,
    price: 22,
    label: '12 Cookies',
    savings: 'Best value',
  },
]

export function getTierById(id: TierId): Tier | undefined {
  return TIERS.find((t) => t.id === id)
}

export function pricePerCookie(tier: Tier): string {
  return (tier.price / tier.cookies).toFixed(2)
}
