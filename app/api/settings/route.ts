import { NextRequest, NextResponse } from 'next/server'
import { readSettings, writeSettings } from '@/lib/settings'

function isAuthorized(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'cookies2024')
}

export async function GET() {
  return NextResponse.json(readSettings())
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const updates = await req.json()
  const current = readSettings()
  const updated = { ...current, ...updates }
  writeSettings(updated)
  return NextResponse.json(updated)
}
