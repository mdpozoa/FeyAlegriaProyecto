# Plan de Negocio y Sostenibilidad

> *Este documento es una plantilla para guiar la redacción final del Plan de Negocio (Asignación A) y el Plan de Sostenibilidad.*

## 1. Documento de Plan de Negocio (Resumen)
*(Debe desarrollarse en detalle según las 8 secciones de la Asignación A)*

1. **Resumen Ejecutivo:** Aplicación web de reporte de incidentes para mejorar la seguridad en los alrededores de la U.E. Fe y Alegría La Dolorosa.
2. **Descripción del Problema:** Percepción de inseguridad, falta de canales confidenciales de reporte por parte de los estudiantes.
3. **Propuesta de Valor:** Mapa interactivo en tiempo real que consolida reportes anónimos y permite a las autoridades tomar decisiones preventivas.
4. **Análisis de Mercado / Beneficiarios:** Estudiantes, Autoridades y Comunidad de Llano Grande.
5. **Modelo de Funcionamiento:** B2B Institucional o sin fines de lucro (Mantenido por donaciones, vinculación universitaria, etc.).
6. **Estrategia de Adopción:** Capacitaciones en horas de tutoría, campañas de concientización.
7. **Equipo Emprendedor:** (Nombres de los estudiantes).
8. **Requerimientos Financieros:** (Ver sección de Análisis Financiero abajo).

## 2. Análisis Financiero y Flujo de Caja (6 meses)
> *El equipo debe incluir en esta sección (o adjuntar un Excel) el flujo de caja.*

- **Costos Iniciales:** Desarrollo, dominio, tiempo de estudiantes (costo sombra).
- **Costos Recurrentes (Mensuales):** Mantenimiento (si aplica), internet.
- **Ingresos/Auspicios:** (Fondos de la universidad, donaciones de la comunidad).
- **VAN (Valor Actual Neto):** `[Valor a calcular]`
- **TIR (Tasa Interna de Retorno):** `[Valor a calcular]`

## 3. Plan de Sostenibilidad (Continuidad del Proyecto)
El mayor riesgo de los proyectos universitarios es que mueran cuando el equipo se gradúa. 

**¿Qué pasa cuando el equipo se gradúe?**
- El código será liberado como Open Source (Licencia MIT) entregado al colegio.
- Se transferirán las credenciales genéricas descritas en el documento de Accesos.
- Posibilidad de crear un "Club de Informática" en la Unidad Educativa para que los estudiantes de bachillerato técnico lo mantengan.

**¿Quién mantiene el proyecto?**
- En primera instancia, el equipo de desarrolladores (compromiso de soporte de X meses).
- Posteriormente, las autoridades o un nuevo grupo de vinculación.

**Uso de Herramientas Gratuitas (Capa Hobby):**
- **Hosting:** Vercel (Gratis).
- **Base de Datos:** Supabase (Gratis, hasta 500MB).
- **Mapas:** Nominatim / OpenStreetMap (Gratis, Open Source).

**Plan B (Si una herramienta deja de ser gratuita o cambia de políticas):**
- *Si Vercel cobra:* Migrar a Render, Railway o Netlify. El código Vue/Express es agnóstico y portable.
- *Si Supabase cobra:* Migrar a MongoDB Atlas (gratis), Firebase o desplegar un contenedor Docker local con PostgreSQL si el colegio adquiere un servidor físico.
- *Si Supabase "pausa" la BD por inactividad:* Las autoridades deben hacer login al menos una vez por semana, o reactivarla con un clic en el dashboard proporcionado.
