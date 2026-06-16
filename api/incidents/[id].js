import { query } from './../_lib/db.js'
import { requireAuthority } from './../_lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Método no permitido' })

  const authUser = requireAuthority(req, res)
  if (!authUser) return

  const { id } = req.query
  const { estado } = req.body

  const estadosValidos = ['Reportado', 'Revisado', 'En Proceso']
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Debe ser: ${estadosValidos.join(', ')}` })
  }

  try {
    const exist = await query('SELECT id FROM incidentes WHERE id = $1', [id])
    if (!exist.rows[0]) {
      return res.status(404).json({ error: 'Incidente no encontrado' })
    }

    await query('UPDATE incidentes SET estado = $1 WHERE id = $2', [estado, id])
    return res.json({ id, estado })
  } catch (err) {
    console.error('Error PATCH /incidents/[id]:', err)
    return res.status(500).json({ error: 'Error al actualizar el estado' })
  }
}
