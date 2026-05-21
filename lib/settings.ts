import fs from 'fs'
import path from 'path'

export interface ShopSettings {
  acceptingOrders: boolean
  batchInfo: string
  availableSpots: number
  cutoffTime: string
  pickupInstructions: string
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

const DEFAULT_SETTINGS: ShopSettings = {
  acceptingOrders: true,
  batchInfo: 'Next batch ready at 4pm today',
  availableSpots: 12,
  cutoffTime: '2:00 PM',
  pickupInstructions: 'Pickup available between 4–7pm. Address confirmed after your order.',
}

export function readSettings(): ShopSettings {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function writeSettings(settings: ShopSettings) {
  const sanitised: ShopSettings = {
    ...settings,
    availableSpots: Math.max(0, Math.floor(settings.availableSpots)),
    batchInfo: settings.batchInfo?.trim() || DEFAULT_SETTINGS.batchInfo,
    cutoffTime: settings.cutoffTime?.trim() || DEFAULT_SETTINGS.cutoffTime,
    pickupInstructions:
      settings.pickupInstructions?.trim() || DEFAULT_SETTINGS.pickupInstructions,
  }
  const dir = path.dirname(SETTINGS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(sanitised, null, 2))
}
