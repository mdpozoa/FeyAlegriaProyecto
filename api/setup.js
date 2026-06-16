import { query } from './_lib/db.js'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

// Endpoint para inicializar la BD — llamar UNA SOLA VEZ tras el despliegue
// Protegido con clave de setup para evitar uso no autorizado
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // Verificación de clave secreta de setup
  const setupKey = req.headers['x-setup-key'] || req.query.key
  const expectedKey = process.env.SETUP_KEY || 'safecampus-setup-2024'
  if (setupKey !== expectedKey) {
    return res.status(403).json({ error: 'Clave de setup incorrecta' })
  }

  const log = []

  try {
    // ── TABLAS ──────────────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS tipos_incidente (
        id TEXT PRIMARY KEY,
        nombre TEXT UNIQUE NOT NULL
      )
    `)
    log.push('✅ tabla tipos_incidente')

    await query(`
      CREATE TABLE IF NOT EXISTS jornadas (
        id TEXT PRIMARY KEY,
        nombre TEXT UNIQUE NOT NULL
      )
    `)
    log.push('✅ tabla jornadas')

    await query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        contrasena_hash TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('ESTUDIANTE', 'AUTORIDAD')),
        creado_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    log.push('✅ tabla usuarios')

    await query(`
      CREATE TABLE IF NOT EXISTS perfiles_estudiante (
        id TEXT PRIMARY KEY,
        usuario_id TEXT UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        nivel_educativo TEXT CHECK(nivel_educativo IN ('Básica', 'Bachillerato')),
        grado_curso TEXT
      )
    `)
    log.push('✅ tabla perfiles_estudiante')

    await query(`
      CREATE TABLE IF NOT EXISTS incidentes (
        id TEXT PRIMARY KEY,
        tipo_id TEXT NOT NULL REFERENCES tipos_incidente(id),
        severidad TEXT NOT NULL CHECK(severidad IN ('HIGH', 'MEDIUM', 'LOW')),
        jornada_id TEXT NOT NULL REFERENCES jornadas(id),
        hora_aprox TEXT NOT NULL,
        latitud REAL NOT NULL,
        longitud REAL NOT NULL,
        reportero_id TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
        descripcion TEXT,
        estado TEXT NOT NULL DEFAULT 'Reportado' CHECK(estado IN ('Reportado', 'Revisado', 'En Proceso')),
        creado_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    log.push('✅ tabla incidentes')

    // ── CATÁLOGOS ───────────────────────────────────────────────────────────
    await query(`
      INSERT INTO tipos_incidente (id, nombre) VALUES
      ('t1', 'Robo'), ('t2', 'Acoso'), ('t3', 'Zona Oscura'), ('t4', 'Infraestructura'), ('t5', 'Otros')
      ON CONFLICT DO NOTHING
    `)
    log.push('✅ catálogo tipos_incidente')

    await query(`
      INSERT INTO jornadas (id, nombre) VALUES ('j1', 'Matutina'), ('j2', 'Vespertina')
      ON CONFLICT DO NOTHING
    `)
    log.push('✅ catálogo jornadas')

    // ── ADMINISTRADOR ───────────────────────────────────────────────────────
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@safecampus.edu.ec').toLowerCase()
    const adminPassword = process.env.ADMIN_PASSWORD || 'SafeCampus2024!'
    const adminNombre = process.env.ADMIN_NAME || 'Administrador SafeCampus'

    const adminExiste = await query('SELECT id FROM usuarios WHERE email = $1', [adminEmail])
    if (!adminExiste.rows[0]) {
      const hash = await bcrypt.hash(adminPassword, 12)
      const adminId = randomUUID()
      await query(
        `INSERT INTO usuarios (id, nombre, email, contrasena_hash, rol) VALUES ($1, $2, $3, $4, 'AUTORIDAD')`,
        [adminId, adminNombre, adminEmail, hash]
      )
      log.push(`✅ administrador creado: ${adminEmail}`)
    } else {
      log.push(`ℹ️ administrador ya existe: ${adminEmail}`)
    }

    return res.json({ success: true, log })
  } catch (err) {
    console.error('Error en setup:', err)
    return res.status(500).json({ error: err.message, log })
  }
}
