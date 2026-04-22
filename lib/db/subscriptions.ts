import sql from '@/lib/db'

export interface Subscription {
  id: string
  createdAt: string
  customerEmail: string
  customerName: string
  phone: string
  fulfillment: 'pickup' | 'delivery'
  tierId: 'small' | 'medium' | 'large'
  status: 'active' | 'paused' | 'cancelled'
  stripeSubscriptionId: string
  stripeCustomerId: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSubscription(row: any): Subscription {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    phone: row.phone,
    fulfillment: row.fulfillment,
    tierId: row.tier_id,
    status: row.status,
    stripeSubscriptionId: row.stripe_subscription_id,
    stripeCustomerId: row.stripe_customer_id,
  }
}

export async function getSubscriptionByEmail(email: string): Promise<Subscription | null> {
  const rows = await sql`
    SELECT * FROM subscriptions
    WHERE lower(customer_email) = lower(${email}) AND status = 'active'
    ORDER BY created_at DESC LIMIT 1
  `
  return rows[0] ? rowToSubscription(rows[0]) : null
}

export async function createSubscription(data: Omit<Subscription, 'id' | 'createdAt'>): Promise<Subscription> {
  const rows = await sql`
    INSERT INTO subscriptions (
      customer_email, customer_name, phone, fulfillment,
      tier_id, status, stripe_subscription_id, stripe_customer_id
    ) VALUES (
      ${data.customerEmail}, ${data.customerName}, ${data.phone}, ${data.fulfillment},
      ${data.tierId}, ${data.status}, ${data.stripeSubscriptionId}, ${data.stripeCustomerId}
    )
    RETURNING *
  `
  return rowToSubscription(rows[0])
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: 'active' | 'paused' | 'cancelled'
): Promise<void> {
  await sql`
    UPDATE subscriptions SET status = ${status}
    WHERE stripe_subscription_id = ${stripeSubscriptionId}
  `
}

export async function getActiveSubscriptionCount(): Promise<number> {
  const rows = await sql`SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'`
  return parseInt(rows[0].count as string, 10)
}
