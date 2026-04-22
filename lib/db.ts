import { neon, NeonQueryFunction } from '@neondatabase/serverless'

let _sql: NeonQueryFunction<false, false> | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

// Re-export as a tagged-template-compatible callable by forwarding all calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sql = ((...args: any[]) => (getSql() as any)(...args)) as NeonQueryFunction<false, false>

export default sql
