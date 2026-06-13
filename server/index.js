import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { initDB } from './database.js'

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'safecampus-dev-secret-change-in-production'

// ============================================================
// MIDDLEWARE BASE
// ============================================================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())

// ============================================================
// SSE: Clientes suscritos para tiempo real
// ============================================================
const sseClients = new Set()

function broadcastSSE(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`
  for (const client of sseClients) {
    try {
      client.write(payload)
    } catch (e) {
      sseClients.delete(client)
    }
  }
}

// ============================================================
// MIDDLEWARE JWT → Verifica token en rutas protegidas
// ============================================================
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  // SSE (EventSource) no soporta headers custom → acepta token por query param
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

function requireAuthority(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.rol !== 'AUTORIDAD') {
      return res.status(403).json({ error: 'Acceso solo para autoridades' })
    }
    next()
  })
}

// ============================================================
// DB INIT
// ============================================================
let db

initDB().then(database => {
  db = database
  console.log('✅ Base de datos SQLite inicializada (3FN)')
  app.listen(PORT, () => {
    console.log(`🚀 Servidor SafeCampus corriendo en http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('❌ Error al inicializar la base de datos:', err)
  process.exit(1)
})

// ============================================================
// RUTAS PÚBLICAS
// ============================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// REGISTRO de estudiante
app.post('/api/auth/register', async (req, res) => {
  const { nombre, email, password, nivelEducativo, gradoCurso } = req.body

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
  }

  try {
    const existe = await db.get('SELECT id FROM usuarios WHERE email = ?', [email.toLowerCase().trim()])
    if (existe) {
      return res.status(409).json({ error: 'Ya existe una cuenta con este correo electrónico' })
    }

    const hash = await bcrypt.hash(password, 12)
    const userId = crypto.randomUUID()

    await db.run(
      `INSERT INTO usuarios (id, nombre, email, contrasena_hash, rol) VALUES (?, ?, ?, ?, 'ESTUDIANTE')`,
      [userId, nombre.trim(), email.toLowerCase().trim(), hash]
    )

    // Crear perfil de estudiante
    await db.run(
      `INSERT INTO perfiles_estudiante (id, usuario_id, nivel_educativo, grado_curso) VALUES (?, ?, ?, ?)`,
      [crypto.randomUUID(), userId, nivelEducativo || 'Bachillerato', gradoCurso || '']
    )

    // Generar token
    const token = jwt.sign(
      { id: userId, rol: 'ESTUDIANTE', nombre: nombre.trim(), email: email.toLowerCase().trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const perfil = await db.get('SELECT nivel_educativo, grado_curso FROM perfiles_estudiante WHERE usuario_id = ?', [userId])

    res.status(201).json({
      token,
      user: {
        id: userId,
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
        rol: 'ESTUDIANTE',
        nivel_educativo: perfil?.nivel_educativo,
        grado_curso: perfil?.grado_curso
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' })
  }

  try {
    const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email.toLowerCase().trim()])

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
      perfil = await db.get('SELECT nivel_educativo, grado_curso FROM perfiles_estudiante WHERE usuario_id = ?', [user.id])
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
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
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ============================================================
// RUTAS PROTEGIDAS - INCIDENTES
// ============================================================

// GET: Todos los incidentes (con JOINs para devolver nombres en lugar de IDs)
app.get('/api/incidents', requireAuth, async (req, res) => {
  try {
    const incidents = await db.all(`
      SELECT
        i.id,
        ti.nombre  AS tipo,
        i.severidad,
        j.nombre   AS jornada,
        i.hora_aprox AS "horaAprox",
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
    res.json(incidents)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener los incidentes' })
  }
})

// POST: Crear incidente
app.post('/api/incidents', requireAuth, async (req, res) => {
  const { tipo, severidad, jornada, horaAprox, latitud, longitud, descripcion } = req.body

  if (!tipo || !severidad || !jornada || !horaAprox || latitud === undefined || longitud === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  if (tipo === 'Otros' && (!descripcion || !descripcion.trim())) {
    return res.status(400).json({ error: 'La descripción es obligatoria para el tipo "Otros"' })
  }

  try {
    const tipoRow = await db.get('SELECT id FROM tipos_incidente WHERE nombre = ?', [tipo])
    const jornadaRow = await db.get('SELECT id FROM jornadas WHERE nombre = ?', [jornada])

    if (!tipoRow || !jornadaRow) {
      return res.status(400).json({ error: 'Tipo o jornada inválidos' })
    }

    const id = crypto.randomUUID()
    await db.run(
      `INSERT INTO incidentes (id, tipo_id, severidad, jornada_id, hora_aprox, latitud, longitud, reportero_id, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tipoRow.id, severidad, jornadaRow.id, horaAprox, latitud, longitud, req.user.id, descripcion || null]
    )

    const newIncident = await db.get(`
      SELECT i.id, ti.nombre AS tipo, i.severidad, j.nombre AS jornada,
             i.hora_aprox AS "horaAprox", i.latitud, i.longitud,
             i.reportero_id AS "reporteroId", i.descripcion, i.estado, i.creado_at AS "creadoAt"
      FROM incidentes i
      JOIN tipos_incidente ti ON i.tipo_id = ti.id
      JOIN jornadas j ON i.jornada_id = j.id
      WHERE i.id = ?
    `, [id])

    // Notificar a todos los clientes SSE
    broadcastSSE('new_incident', newIncident)

    res.status(201).json(newIncident)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al registrar el incidente' })
  }
})

// PATCH: Actualizar estado (solo autoridades)
app.patch('/api/incidents/:id/status', requireAuthority, async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  const estadosValidos = ['Reportado', 'Revisado', 'En Proceso']
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Debe ser: ${estadosValidos.join(', ')}` })
  }

  try {
    const incidente = await db.get('SELECT id FROM incidentes WHERE id = ?', [id])
    if (!incidente) {
      return res.status(404).json({ error: 'Incidente no encontrado' })
    }

    await db.run('UPDATE incidentes SET estado = ? WHERE id = ?', [estado, id])

    // Notificar a todos los clientes SSE del cambio de estado
    broadcastSSE('status_updated', { id, estado })

    res.json({ id, estado })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar el estado' })
  }
})

// ============================================================
// SSE: Endpoint de tiempo real
// ============================================================
app.get('/api/incidents/stream', requireAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Para Nginx/Railway

  // Enviar heartbeat inicial
  res.write('event: connected\ndata: {"message":"Conectado al stream de SafeCampus"}\n\n')

  // Heartbeat cada 25s para mantener la conexión viva
  const heartbeat = setInterval(() => {
    try {
      res.write(':heartbeat\n\n')
    } catch (e) {
      clearInterval(heartbeat)
    }
  }, 25000)

  sseClients.add(res)
  console.log(`📡 Cliente SSE conectado. Total: ${sseClients.size}`)

  req.on('close', () => {
    sseClients.delete(res)
    clearInterval(heartbeat)
    console.log(`📴 Cliente SSE desconectado. Total: ${sseClients.size}`)
  })
})

// ============================================================
// CATÁLOGOS (públicos, para poblar formularios)
// ============================================================
app.get('/api/catalogs', async (req, res) => {
  try {
    const tipos = await db.all('SELECT id, nombre FROM tipos_incidente ORDER BY id')
    const jornadas = await db.all('SELECT id, nombre FROM jornadas ORDER BY id')
    res.json({ tipos, jornadas })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener catálogos' })
  }
})
