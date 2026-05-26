import sql from '@/lib/db'

export interface ShopSettings {
  acceptingOrders: boolean
  batchInfo: string
  availableSpots: number
  cutoffTime: string
  pickupInstructions: string
}

const DEFAULT: ShopSettings = {
  acceptingOrders: true,
  batchInfo: 'Next batch ready at 4pm today',
  availableSpots: 12,
  cutoffTime: '2:00 PM',
  pickupInstructions: 'Pickup available between 4–7pm. Address confirmed after your order.',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSettings(row: any): ShopSettings {
  return {
    acceptingOrders: row.accepting_orders,
    batchInfo: row.batch_info,
    availableSpots: row.available_spots,
    cutoffTime: row.cutoff_time,
    pickupInstructions: row.pickup_instructions,
  }
}

export async function getSettings(): Promise<ShopSettings> {
  try {
    const rows = await sql`SELECT * FROM settings WHERE id = 1`
    return rows[0] ? rowToSettings(rows[0]) : DEFAULT
  } catch {
    return DEFAULT
  }
}

export async function updateSettings(updates: Partial<ShopSettings>): Promise<ShopSettings> {
  const rows = await sql`
    UPDATE settings SET
      accepting_orders    = COALESCE(${updates.acceptingOrders ?? null}, accepting_orders),
      batch_info          = COALESCE(${updates.batchInfo ?? null}, batch_info),
      available_spots     = COALESCE(${updates.availableSpots ?? null}, available_spots),
      cutoff_time         = COALESCE(${updates.cutoffTime ?? null}, cutoff_time),
      pickup_instructions = COALESCE(${updates.pickupInstructions ?? null}, pickup_instructions)
    WHERE id = 1
    RETURNING *
  `
  return rowToSettings(rows[0])
}
