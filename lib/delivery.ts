const STORE_ORIGIN = process.env.STORE_ADDRESS ?? 'LaSalle, Montreal, QC, Canada'

const FEE_TIERS = [
  { maxKm: 5, feeCents: 500 },
  { maxKm: 10, feeCents: 900 },
  { maxKm: 15, feeCents: 1300 },
]

export type DeliveryResult =
  | { ok: true; feeCents: number; distanceKm: number }
  | { ok: false; error: string }

export async function calculateDeliveryFee(address: string, city: string): Promise<DeliveryResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return { ok: false, error: 'Delivery fee calculation unavailable' }

  const destination = encodeURIComponent(`${address.trim()}, ${city.trim()}, QC, Canada`)
  const origin = encodeURIComponent(STORE_ORIGIN)
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=driving&units=metric&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK' || data.rows?.[0]?.elements?.[0]?.status !== 'OK') {
    return { ok: false, error: 'Could not calculate distance. Please verify your address.' }
  }

  const distanceMeters: number = data.rows[0].elements[0].distance.value
  const distanceKm = distanceMeters / 1000
  const rounded = Math.round(distanceKm * 10) / 10

  const tier = FEE_TIERS.find((t) => distanceKm <= t.maxKm)
  if (!tier) {
    return { ok: false, error: `Sorry, we only deliver within 15 km. Your address is ${rounded} km away.` }
  }

  return { ok: true, feeCents: tier.feeCents, distanceKm: rounded }
}
