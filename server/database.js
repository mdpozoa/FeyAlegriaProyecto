import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function initDB() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  })

  await db.exec("PRAGMA foreign_keys = ON")
  await db.exec("PRAGMA journal_mode = WAL")

  // ============================================================
  // TABLAS EN TERCERA FORMA NORMAL (3FN)
  // ============================================================

  // Catálogo de tipos de incidente (elimina dependencias transitivas)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tipos_incidente (
      id   TEXT PRIMARY KEY,
      nombre TEXT UNIQUE NOT NULL
    )
  `)

  // Catálogo de jornadas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jornadas (
      id     TEXT PRIMARY KEY,
      nombre TEXT UNIQUE NOT NULL
    )
  `)

  // Tabla principal de usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id              TEXT PRIMARY KEY,
      nombre          TEXT NOT NULL,
      email           TEXT UNIQUE NOT NULL,
      contrasena_hash TEXT NOT NULL,
      rol             TEXT NOT NULL CHECK(rol IN ('ESTUDIANTE', 'AUTORIDAD')),
      creado_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Perfil extendido del estudiante (separado por 3FN)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS perfiles_estudiante (
      id              TEXT PRIMARY KEY,
      usuario_id      TEXT UNIQUE NOT NULL,
      nivel_educativo TEXT CHECK(nivel_educativo IN ('Básica', 'Bachillerato')),
      grado_curso     TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `)

  // Tabla de incidentes (usa FKs a catálogos)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes (
      id           TEXT PRIMARY KEY,
      tipo_id      TEXT NOT NULL,
      severidad    TEXT NOT NULL CHECK(severidad IN ('HIGH', 'MEDIUM', 'LOW')),
      jornada_id   TEXT NOT NULL,
      hora_aprox   TEXT NOT NULL,
      latitud      REAL NOT NULL,
      longitud     REAL NOT NULL,
      reportero_id TEXT,
      descripcion  TEXT,
      estado       TEXT NOT NULL DEFAULT 'Reportado' CHECK(estado IN ('Reportado', 'Revisado', 'En Proceso')),
      creado_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tipo_id)      REFERENCES tipos_incidente(id),
      FOREIGN KEY (jornada_id)   REFERENCES jornadas(id),
      FOREIGN KEY (reportero_id) REFERENCES usuarios(id) ON DELETE SET NULL
    )
  `)

  // ============================================================
  // POBLAR CATÁLOGOS (si están vacíos)
  // ============================================================
  const tiposCount = await db.get('SELECT COUNT(*) as c FROM tipos_incidente')
  if (tiposCount.c === 0) {
    await db.exec(`
      INSERT INTO tipos_incidente (id, nombre) VALUES
      ('t1', 'Robo'),
      ('t2', 'Acoso'),
      ('t3', 'Zona Oscura'),
      ('t4', 'Infraestructura'),
      ('t5', 'Otros')
    `)
  }

  const jornadasCount = await db.get('SELECT COUNT(*) as c FROM jornadas')
  if (jornadasCount.c === 0) {
    await db.exec(`
      INSERT INTO jornadas (id, nombre) VALUES
      ('j1', 'Matutina'),
      ('j2', 'Vespertina')
    `)
  }

  // ============================================================
  // CREAR USUARIO ADMINISTRADOR (si no existe)
  // ============================================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@safecampus.edu.ec'
  const adminPassword = process.env.ADMIN_PASSWORD || 'SafeCampus2024!'
  const adminNombre = process.env.ADMIN_NAME || 'Administrador SafeCampus'

  const adminExiste = await db.get('SELECT id FROM usuarios WHERE email = ?', [adminEmail])
  if (!adminExiste) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await db.run(
      `INSERT INTO usuarios (id, nombre, email, contrasena_hash, rol) VALUES (?, ?, ?, ?, 'AUTORIDAD')`,
      [crypto.randomUUID(), adminNombre, adminEmail, hash]
    )
    console.log(`✅ Administrador creado: ${adminEmail}`)
  }

  return db
}
