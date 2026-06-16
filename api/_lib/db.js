import pg from 'pg'
const { Pool } = pg

// Singleton pool — en serverless cada instancia tiene su propio pool pequeño
let pool = null

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables!')
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3, // Máximo 3 conexiones por función serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })
  }
  return pool
}

export async function query(sql, params = []) {
  const p = getPool()
  const client = await p.connect()
  try {
    const result = await client.query(sql, params)
    return result
  } finally {
    client.release()
  }
}
