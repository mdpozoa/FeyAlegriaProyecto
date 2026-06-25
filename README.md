# SafeCampus Monitor

## Descripción del Proyecto
SafeCampus Monitor es una aplicación web desarrollada para el proyecto integrador, enfocada en la comunidad de Fe y Alegría La Dolorosa (Llano Grande, Calderón, Quito). Su objetivo principal es permitir a los estudiantes reportar incidentes de seguridad y a las autoridades monitorear zonas críticas mediante un dashboard interactivo geolocalizado en tiempo real. 

## Estructura de Carpetas

- `api/` - Contiene las Vercel Serverless Functions (backend). Incluye lógica de autenticación y conexión a base de datos.
- `docs/` - Documentación técnica y entregables del proyecto (arquitectura, manuales, negocio).
- `public/` - Archivos estáticos públicos.
- `server/` - Script de base de datos local SQLite (para desarrollo si no se usa Supabase).
- `src/` - Código fuente del frontend (Vue 3).
  - `assets/` - Recursos estáticos, imágenes y estilos globales.
  - `components/` - Componentes reutilizables de Vue (como el mapa de Leaflet).
  - `stores/` - Manejo de estado global usando Pinia.
  - `views/` - Vistas principales de la aplicación (Home, Login, Estudiante, Autoridad).
  - `router/` - Configuración de rutas de Vue Router.

## Requisitos Previos
- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- Cuenta de GitHub
- Cuenta en [Vercel](https://vercel.com/) (para despliegue)
- Base de datos PostgreSQL (ej: [Supabase](https://supabase.com/))

## Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto. **NO UTILIZAR DATOS REALES EN ESTE ARCHIVO SI SE VA A SUBIR AL REPOSITORIO** (el archivo `.env.local` ya está ignorado en `.gitignore`).

Plantilla `.env.example`:
```env
# Conexión a Base de Datos PostgreSQL
DATABASE_URL="postgresql://postgres.USER:PASSWORD@host:6543/postgres?pgbouncer=true"

# JWT Secret para la generación de tokens (mínimo 64 caracteres)
JWT_SECRET="CAMBIA_ESTO_POR_UNA_CLAVE_MUY_LARGA_Y_ALEATORIA"

# Credenciales del Administrador (creado automáticamente al ejecutar setup)
ADMIN_EMAIL="admin@safecampus.edu.ec"
ADMIN_PASSWORD="TuContraseñaSegura123!"
ADMIN_NAME="Administrador SafeCampus"

# Clave de seguridad para ejecutar el endpoint de configuración inicial
SETUP_KEY="safecampus-setup-2024"

# Mapa
VITE_MAP_DEFAULT_LAT=-0.1188
VITE_MAP_DEFAULT_LNG=-78.4269
VITE_MAP_DEFAULT_ZOOM=17
```

## Instrucciones de Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/mdpozoa/FeyAlegriaProyecto.git
   cd FeyAlegriaProyecto
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   - Copia `.env.example` a `.env.local` y configura los valores con credenciales de prueba.

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## Librerías y Repositorios de Terceros (Transparencia de Autoría)

Este proyecto utiliza las siguientes librerías de software libre (Open Source), cumpliendo con sus respectivas licencias:
- **Vue.js** (MIT) - Framework de Frontend
- **Vite** (MIT) - Bundler y herramienta de desarrollo
- **Leaflet** (BSD-2-Clause) - Biblioteca de mapas interactivos
- **Pinia** (MIT) - Manejo de estado
- **Vue Router** (MIT) - Enrutamiento
- **Express / Vercel Serverless** (MIT) - Backend
- **PostgreSQL / pg** (PostgreSQL License) - Cliente de BD
- **Bcryptjs** (MIT) - Hashing de contraseñas
- **JsonWebToken** (MIT) - Autenticación por tokens

*(Se aplican las condiciones estipuladas en el archivo LICENSE)*
