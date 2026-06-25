# Diccionario de Datos

Este documento describe la estructura y el propósito de cada tabla y campo en la base de datos PostgreSQL de SafeCampus Monitor.

## 1. Tabla: `tipos_incidente`
**Propósito:** Catálogo que normaliza los tipos de incidentes que pueden ser reportados (ej. Robo, Acoso).

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Identificador único del tipo de incidente (ej. 't1') |
| `nombre` | TEXT | UNIQUE, NOT NULL | Nombre legible del tipo de incidente |

## 2. Tabla: `jornadas`
**Propósito:** Catálogo de las jornadas de estudio disponibles.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Identificador único de la jornada (ej. 'j1') |
| `nombre` | TEXT | UNIQUE, NOT NULL | Nombre de la jornada (ej. 'Matutina') |

## 3. Tabla: `usuarios`
**Propósito:** Almacena la información principal de autenticación y datos básicos de todos los usuarios (Estudiantes y Autoridades).

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID único del usuario |
| `nombre` | TEXT | NOT NULL | Nombre completo del usuario |
| `email` | TEXT | UNIQUE, NOT NULL | Correo electrónico usado para inicio de sesión |
| `contrasena_hash` | TEXT | NOT NULL | Contraseña encriptada (Bcrypt) |
| `rol` | TEXT | CHECK IN ('ESTUDIANTE', 'AUTORIDAD') | Rol de autorización del usuario en el sistema |
| `creado_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha y hora de creación de la cuenta |

## 4. Tabla: `perfiles_estudiante`
**Propósito:** Almacena información adicional específica para usuarios con rol de ESTUDIANTE. Separado por normalización (3FN).

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID único del perfil |
| `usuario_id` | TEXT | UNIQUE, FK(usuarios.id), ON DELETE CASCADE | Relación 1:1 con la tabla usuarios |
| `nivel_educativo` | TEXT | CHECK IN ('Básica', 'Bachillerato') | Nivel de estudios del estudiante |
| `grado_curso` | TEXT | | Grado, curso o paralelo (ej. "1ro BGU A") |

## 5. Tabla: `incidentes`
**Propósito:** Almacena los reportes de incidentes de seguridad generados por los estudiantes.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID único del reporte |
| `tipo_id` | TEXT | FK(tipos_incidente.id), NOT NULL | Tipo de incidente reportado |
| `severidad` | TEXT | CHECK IN ('HIGH', 'MEDIUM', 'LOW'), NOT NULL | Nivel de urgencia / riesgo del incidente |
| `jornada_id` | TEXT | FK(jornadas.id), NOT NULL | Jornada en la que ocurrió el incidente |
| `hora_aprox` | TEXT | NOT NULL | Hora aproximada del suceso |
| `latitud` | REAL | NOT NULL | Coordenada geográfica (latitud) |
| `longitud` | REAL | NOT NULL | Coordenada geográfica (longitud) |
| `reportero_id` | TEXT | FK(usuarios.id), ON DELETE SET NULL | ID del estudiante que reporta. Se mantiene en NULL si se borra el usuario |
| `descripcion` | TEXT | | Detalles adicionales proporcionados por el estudiante |
| `estado` | TEXT | DEFAULT 'Reportado', CHECK IN ('Reportado', 'Revisado', 'En Proceso') | Estado de seguimiento por parte de la autoridad |
| `creado_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha y hora en que se ingresó el reporte |
