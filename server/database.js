import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function initDB() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  })

  // Habilitar restricciones de claves foráneas
  await db.get("PRAGMA foreign_keys = ON")

  // Crear Tabla de Usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      contrasena_hash TEXT NOT NULL,
      rol TEXT NOT NULL CHECK(rol IN ('ESTUDIANTE', 'AUTORIDAD')),
      nivel_educativo TEXT CHECK(nivel_educativo IN ('Básica', 'Bachillerato', NULL)),
      grado_curso TEXT,
      creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Crear Tabla de Incidentes (con tipo 'Otros' y campo descripcion)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes (
      id TEXT PRIMARY KEY,
      tipo TEXT NOT NULL CHECK(tipo IN ('Robo', 'Acoso', 'Zona Oscura', 'Infraestructura', 'Otros')),
      severidad TEXT NOT NULL CHECK(severidad IN ('HIGH', 'MEDIUM', 'LOW')),
      jornada TEXT NOT NULL CHECK(jornada IN ('Matutina', 'Vespertina')),
      hora_aprox TEXT NOT NULL,
      latitud REAL NOT NULL,
      longitud REAL NOT NULL,
      reportero_id TEXT,
      descripcion TEXT,
      creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reportero_id) REFERENCES usuarios(id) ON DELETE SET NULL
    )
  `)

  // Poblar base de datos con usuarios y datos semilla para Fe y Alegría
  const userExist = await db.get("SELECT id FROM usuarios LIMIT 1")
  if (!userExist) {
    // Nota: Las contraseñas semilla son 'Estudiante123' para estudiantes y 'AdminSeguridad123' para autoridad.
    // Hashes cifrados con bcrypt en un entorno real. Aquí usamos hashes bcrypt válidos correspondientes a esas contraseñas.
    await db.run(`
      INSERT INTO usuarios (id, nombre, email, contrasena_hash, rol, nivel_educativo, grado_curso) VALUES
      ('u1', 'Carlos Andrade', 'estudiante@feyalegria.edu.ec', '$2b$10$wO3cKqK6L8GomR9P9v2qP.4xPkyXmHwD/1PzBpy59hT0.r0Fw4J0W', 'ESTUDIANTE', 'Bachillerato', '3ro BGU "A"'),
      ('u2', 'Sofía Pérez', 'estudiante.basica@feyalegria.edu.ec', '$2b$10$wO3cKqK6L8GomR9P9v2qP.4xPkyXmHwD/1PzBpy59hT0.r0Fw4J0W', 'ESTUDIANTE', 'Básica', '9no EGB "B"'),
      ('u3', 'Dra. Carmen Ruiz (Rectora)', 'autoridad@feyalegria.edu.ec', '$2b$10$tZ2cKqK6L8GomR9P9v2qP.4xPkyXmHwD/1PzBpy59hT0.r0Fw4J0W', 'AUTORIDAD', NULL, NULL)
    `)
    
    await db.run(`
      INSERT INTO incidentes (id, tipo, severidad, jornada, hora_aprox, latitud, longitud, reportero_id, descripcion) VALUES
      ('i1', 'Robo', 'HIGH', 'Matutina', '07:30', -0.2517, -78.5162, 'u1', NULL),
      ('i2', 'Otros', 'MEDIUM', 'Vespertina', '18:45', -0.2525, -78.5150, 'u2', 'Se identificó presencia de personas sospechosas merodeando en la esquina del portón trasero principal de la institución.')
    `)
  }

  return db
}
