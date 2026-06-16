import { query } from './_lib/db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const tipos = await query('SELECT id, nombre FROM tipos_incidente ORDER BY id')
    const jornadas = await query('SELECT id, nombre FROM jornadas ORDER BY id')
    return res.json({ tipos: tipos.rows, jornadas: jornadas.rows })
  } catch (err) {
    console.error('Error GET /catalogs:', err)
    return res.status(500).json({ error: 'Error al obtener catálogos' })
  }
}
