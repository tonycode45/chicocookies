import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

function isAuthorized(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'cookies2024')
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      fulfillment TEXT NOT NULL CHECK (fulfillment IN ('pickup','delivery')),
      address TEXT,
      city TEXT,
      items JSONB NOT NULL,
      cookies_total INT NOT NULL,
      subtotal INT NOT NULL,
      delivery_fee INT NOT NULL DEFAULT 0,
      total INT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new','confirmed','baking','ready','out_for_delivery','completed','cancelled')),
      notes TEXT,
      is_event_order BOOLEAN NOT NULL DEFAULT FALSE,
      referred_by TEXT,
      stripe_payment_intent_id TEXT,
      weekly_drop BOOLEAN NOT NULL DEFAULT FALSE
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      fulfillment TEXT NOT NULL CHECK (fulfillment IN ('pickup','delivery')),
      tier_id TEXT NOT NULL CHECK (tier_id IN ('small','medium','large')),
      status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','paused','cancelled')),
      stripe_subscription_id TEXT NOT NULL,
      stripe_customer_id TEXT NOT NULL
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY DEFAULT 1,
      accepting_orders BOOLEAN NOT NULL DEFAULT TRUE,
      batch_info TEXT NOT NULL DEFAULT 'Next batch ready at 4pm today',
      available_spots INT NOT NULL DEFAULT 12,
      cutoff_time TEXT NOT NULL DEFAULT '2:00 PM',
      pickup_instructions TEXT NOT NULL DEFAULT 'Pickup available between 4–7pm. Address confirmed after your order.'
    )
  `

  await sql`INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`

  return NextResponse.json({ ok: true })
}
