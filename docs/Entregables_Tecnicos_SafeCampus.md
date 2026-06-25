# ENTREGABLES TÉCNICOS - SAFECAMPUS MONITOR

Este documento es una compilación de toda la documentación técnica generada para el proyecto.

---
## 1. README (Instrucciones principales)
*(Ubicado en la raíz del proyecto: `/README.md`)*

SafeCampus Monitor es una aplicación web desarrollada para el proyecto integrador, enfocada en la comunidad de Fe y Alegría La Dolorosa.
(Ver el archivo `README.md` completo en la raíz del proyecto para instrucciones de instalación, variables de entorno y librerías utilizadas).

---
## 2. ESQUEMA DE BASE DE DATOS Y DATOS DE PRUEBA
*(Ubicado en la raíz del proyecto: `/database_schema.sql`)*

Contiene el script PostgreSQL completo para crear las tablas en 3ra Forma Normal (3FN) y poblar los catálogos (tipos de incidentes, jornadas).

---
## 3. DICCIONARIO DE DATOS
*(Ubicado en: `/docs/data_dictionary.md`)*

Describe la estructura y el propósito de cada tabla y campo en la base de datos PostgreSQL de SafeCampus Monitor (tablas `tipos_incidente`, `jornadas`, `usuarios`, `perfiles_estudiante`, `incidentes`).

---
## 4. GESTIÓN DE CREDENCIALES Y ACCESOS
*(Ubicado en: `/docs/credentials_template.md`)*

Plantilla que detalla la estructura de credenciales requerida para transferir el control del proyecto al docente (Correo Genérico, Repositorio de GitHub, Vercel, Supabase y Cuentas de Administrador).

---
## 5. ARQUITECTURA TÉCNICA Y SEGURIDAD
*(Ubicado en: `/docs/architecture_and_security.md`)*

Incluye el diagrama de componentes (Frontend Vue, Backend Vercel, Base de Datos Supabase, API Nominatim), justificación del stack tecnológico utilizado y la estrategia de seguridad (Autenticación JWT, Hashing, protección SQL).

---
## 6. MANUAL DE USUARIO Y CAPACITACIÓN
*(Ubicado en: `/docs/user_manual.md`)*

Estructura diseñada para ser la base del manual físico/PDF entregable a la institución Fe y Alegría, incluyendo módulos para estudiantes y autoridades, y espacio reservado para evidencia de capacitación.

---
## 7. PLAN DE NEGOCIO Y SOSTENIBILIDAD
*(Ubicado en: `/docs/business_plan.md`)*

Resumen del plan de negocio y análisis financiero. Detalla el Plan de Sostenibilidad explicando qué pasa al graduarse, quién mantiene el proyecto y los planes de contingencia si las herramientas gratuitas cambian.

---
## 8. EVIDENCIA DE FUNCIONAMIENTO Y VALIDACIÓN
*(Ubicado en: `/docs/validation_and_evidence.md`)*

Espacio reservado para anexar el link al video de demostración real de la plataforma, los resultados de validación con los 5 evaluadores (RDA3) y la decisión estratégica tomada (pivotar/perseverar).

---
## 9. TRANSPARENCIA DE AUTORÍA Y LICENCIAMIENTO
*(Ubicado en: `/docs/authorship_declaration.md`)*

Declaración de que el código entregado es original, el reporte de herramientas de IA utilizadas como apoyo y el compromiso de utilizar solo software libre (Vue, Vite, Leaflet, PostgreSQL, etc.) sin costo de licencias.
