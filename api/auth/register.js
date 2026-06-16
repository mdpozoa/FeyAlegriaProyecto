import { query } from './../_lib/db.js'
import bcrypt from 'bcryptjs'
import { signToken } from './../_lib/auth.js'
import { randomUUID } from 'crypto'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const { nombre, email, password, nivelEducativo, gradoCurso } = req.body

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
  }

  try {
    const emailLower = email.toLowerCase().trim()

    // Verificar si ya existe
    const existe = await query('SELECT id FROM usuarios WHERE email = $1', [emailLower])
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con este correo electrónico' })
    }

    const hash = await bcrypt.hash(password, 12)
    const userId = randomUUID()

    // Insertar usuario
    await query(
      `INSERT INTO usuarios (id, nombre, email, contrasena_hash, rol) VALUES ($1, $2, $3, $4, 'ESTUDIANTE')`,
      [userId, nombre.trim(), emailLower, hash]
    )

    // Insertar perfil de estudiante
    await query(
      `INSERT INTO perfiles_estudiante (id, usuario_id, nivel_educativo, grado_curso) VALUES ($1, $2, $3, $4)`,
      [randomUUID(), userId, nivelEducativo || 'Bachillerato', gradoCurso || '']
    )

    const perfil = await query(
      'SELECT nivel_educativo, grado_curso FROM perfiles_estudiante WHERE usuario_id = $1',
      [userId]
    )

    const user = {
      id: userId,
      nombre: nombre.trim(),
      email: emailLower,
      rol: 'ESTUDIANTE',
      nivel_educativo: perfil.rows[0]?.nivel_educativo || 'Bachillerato',
      grado_curso: perfil.rows[0]?.grado_curso || ''
    }

    const token = signToken({ id: userId, rol: 'ESTUDIANTE', nombre: nombre.trim(), email: emailLower })

    return res.status(201).json({ token, user })
  } catch (err) {
    console.error('Error en registro:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
