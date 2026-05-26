import { NextRequest, NextResponse } from 'next/server'
import { calculateDeliveryFee } from '@/lib/delivery'

export async function POST(req: NextRequest) {
  try {
    const { address, city } = await req.json()
    if (!address?.trim() || !city?.trim()) {
      return NextResponse.json({ error: 'Address and city are required' }, { status: 400 })
    }

    const result = await calculateDeliveryFee(address, city)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 422 })
    }

    return NextResponse.json({ feeCents: result.feeCents, distanceKm: result.distanceKm })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
