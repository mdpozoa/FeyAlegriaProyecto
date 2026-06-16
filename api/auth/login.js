import { query } from './../_lib/db.js'
import bcrypt from 'bcryptjs'
import { signToken } from './../_lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' })
  }

  try {
    const emailLower = email.toLowerCase().trim()

    const result = await query('SELECT * FROM usuarios WHERE email = $1', [emailLower])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    const passwordOk = await bcrypt.compare(password, user.contrasena_hash)
    if (!passwordOk) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    // Obtener perfil de estudiante si aplica
    let perfil = null
    if (user.rol === 'ESTUDIANTE') {
      const perfilResult = await query(
        'SELECT nivel_educativo, grado_curso FROM perfiles_estudiante WHERE usuario_id = $1',
        [user.id]
      )
      perfil = perfilResult.rows[0] || null
    }

    const token = signToken({ id: user.id, rol: user.rol, nombre: user.nombre, email: user.email })

    return res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        nivel_educativo: perfil?.nivel_educativo || null,
        grado_curso: perfil?.grado_curso || null
      }
    })
  } catch (err) {
    console.error('Error en login:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
