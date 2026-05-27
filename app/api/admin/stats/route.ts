import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getActiveSubscriptionCount } from '@/lib/db/subscriptions'

function isAuthorized(req: NextRequest) {
  return !!process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [weekRows, monthRows, activeSubCount] = await Promise.all([
    sql`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE created_at >= ${startOfWeek.toISOString()} AND status NOT IN ('new','cancelled')`,
    sql`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE created_at >= ${startOfMonth.toISOString()} AND status NOT IN ('new','cancelled')`,
    getActiveSubscriptionCount(),
  ])

  return NextResponse.json({
    weekTotal: parseInt(weekRows[0].total as string, 10),
    monthTotal: parseInt(monthRows[0].total as string, 10),
    activeSubscribers: activeSubCount,
  })
}
