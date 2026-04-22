import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/db/settings'

function isAuthorized(req: NextRequest) {
  return req.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'cookies2024')
}

export async function GET() {
  return NextResponse.json(await getSettings())
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await updateSettings(await req.json()))
}
