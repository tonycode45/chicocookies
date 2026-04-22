import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail } from '@/lib/db/orders'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  return NextResponse.json(await getOrdersByEmail(email.trim()))
}
