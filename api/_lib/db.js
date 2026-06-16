import pg from 'pg'
const { Pool } = pg

let pool = null
let workingConnectionString = null

export async function getPool() {
  if (pool) return pool

  const candidates = []
  if (process.env.DATABASE_URL) {
    candidates.push(process.env.DATABASE_URL)
  }
  
  // Agregar candidatos con contraseñas codificadas correctamente
  candidates.push('postgresql://postgres.tdanhzzsgfgqchchmloc:Pelucha2020%40@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true')
  candidates.push('postgresql://postgres.tdanhzzsgfgqchchmloc:Pelucha1726266461%40@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true')

  let lastError = null
  for (const connStr of candidates) {
    let parsedStr = connStr
    // Reemplazar si vienen con @ o @@ sin codificar
    if (parsedStr.includes('Pelucha2020@') || parsedStr.includes('Pelucha2020@@')) {
      parsedStr = parsedStr.replace(/Pelucha2020@+aws/, 'Pelucha2020%40aws')
    }
    if (parsedStr.includes('Pelucha1726266461@') || parsedStr.includes('Pelucha1726266461@@')) {
      parsedStr = parsedStr.replace(/Pelucha1726266461@+aws/, 'Pelucha1726266461%40aws')
    }

    const testPool = new Pool({
      connectionString: parsedStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000
    })

    try {
      const client = await testPool.connect()
      await client.query('SELECT 1')
      client.release()
      
      workingConnectionString = parsedStr
      pool = new Pool({
        connectionString: workingConnectionString,
        ssl: { rejectUnauthorized: false },
        max: 3,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      })
      
      await testPool.end()
      return pool
    } catch (err) {
      lastError = err
      await testPool.end()
    }
  }

  throw new Error(`No se pudo conectar a la base de datos con ningún candidato. Último error: ${lastError ? lastError.message : 'Desconocido'}`)
}

export async function query(sql, params = []) {
  const p = await getPool()
  const client = await p.connect()
  try {
    const result = await client.query(sql, params)
    return result
  } finally {
    client.release()
  }
}
