import { query } from './_lib/db.js'
import { requireAuth } from './_lib/auth.js'
import { randomUUID } from 'crypto'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const user = requireAuth(req, res)
  if (!user) return

  // ─── GET: Lista todos los incidentes ───────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const result = await query(`
        SELECT
          i.id,
          ti.nombre  AS tipo,
          i.severidad,
          j.nombre   AS jornada,
          i.hora_aprox  AS "horaAprox",
          i.latitud,
          i.longitud,
          i.reportero_id AS "reporteroId",
          i.descripcion,
          i.estado,
          i.creado_at AS "creadoAt"
        FROM incidentes i
        JOIN tipos_incidente ti ON i.tipo_id = ti.id
        JOIN jornadas j ON i.jornada_id = j.id
        ORDER BY i.creado_at DESC
      `)
      return res.json(result.rows)
    } catch (err) {
      console.error('Error GET /incidents:', err)
      return res.status(500).json({ error: 'Error al obtener los incidentes' })
    }
  }

  // ─── POST: Crear nuevo incidente ──────────────────────────────────────────
  if (req.method === 'POST') {
    const { tipo, severidad, jornada, horaAprox, latitud, longitud, descripcion } = req.body

    if (!tipo || !severidad || !jornada || !horaAprox || latitud === undefined || longitud === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    if (tipo === 'Otros' && (!descripcion || !descripcion.trim())) {
      return res.status(400).json({ error: 'La descripción es obligatoria para el tipo "Otros"' })
    }

    try {
      const tipoResult = await query('SELECT id FROM tipos_incidente WHERE nombre = $1', [tipo])
      const jornadaResult = await query('SELECT id FROM jornadas WHERE nombre = $1', [jornada])

      if (!tipoResult.rows[0] || !jornadaResult.rows[0]) {
        return res.status(400).json({ error: 'Tipo o jornada inválidos' })
      }

      const id = randomUUID()
      await query(
        `INSERT INTO incidentes (id, tipo_id, severidad, jornada_id, hora_aprox, latitud, longitud, reportero_id, descripcion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, tipoResult.rows[0].id, severidad, jornadaResult.rows[0].id, horaAprox, latitud, longitud, user.id, descripcion || null]
      )

      const newResult = await query(`
        SELECT
          i.id, ti.nombre AS tipo, i.severidad, j.nombre AS jornada,
          i.hora_aprox AS "horaAprox", i.latitud, i.longitud,
          i.reportero_id AS "reporteroId", i.descripcion, i.estado, i.creado_at AS "creadoAt"
        FROM incidentes i
        JOIN tipos_incidente ti ON i.tipo_id = ti.id
        JOIN jornadas j ON i.jornada_id = j.id
        WHERE i.id = $1
      `, [id])

      return res.status(201).json(newResult.rows[0])
    } catch (err) {
      console.error('Error POST /incidents:', err)
      return res.status(500).json({ error: 'Error al registrar el incidente' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
