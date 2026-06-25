-- Script de creación de tablas para PostgreSQL (Supabase / Vercel)
-- 1. TABLAS EN TERCERA FORMA NORMAL (3FN)

CREATE TABLE IF NOT EXISTS tipos_incidente (
  id TEXT PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS jornadas (
  id TEXT PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contrasena_hash TEXT NOT NULL,
  rol TEXT NOT NULL CHECK(rol IN ('ESTUDIANTE', 'AUTORIDAD')),
  creado_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS perfiles_estudiante (
  id TEXT PRIMARY KEY,
  usuario_id TEXT UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nivel_educativo TEXT CHECK(nivel_educativo IN ('Básica', 'Bachillerato')),
  grado_curso TEXT
);

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
);

-- 2. DATOS DE PRUEBA (SEED DATA)
-- Poblar Catálogos

INSERT INTO tipos_incidente (id, nombre) VALUES
  ('t1', 'Robo'), 
  ('t2', 'Acoso'), 
  ('t3', 'Zona Oscura'), 
  ('t4', 'Infraestructura'), 
  ('t5', 'Otros')
ON CONFLICT DO NOTHING;

INSERT INTO jornadas (id, nombre) VALUES 
  ('j1', 'Matutina'), 
  ('j2', 'Vespertina')
ON CONFLICT DO NOTHING;

-- Para crear el usuario administrador inicial, debe realizarse a través 
-- del endpoint de la API: GET /api/setup?key=tu-clave-secreta
-- Esto garantiza que la contraseña se guarde de forma segura usando bcrypt.
