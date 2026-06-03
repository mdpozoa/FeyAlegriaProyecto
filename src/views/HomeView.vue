<template>
  <div class="home-view fade-in">
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-text-content">
          <div class="brand-badge animate-float">
            <span class="badge-dot"></span>
            Proyecto Integrador Fe y Alegría
          </div>
          <h1>
            Hacia un entorno escolar <br />
            <span class="highlight-text">más seguro y vigilado</span>
          </h1>
          <p class="hero-description">
            SafeCampus Monitor es la plataforma de geolocalización de incidentes que empodera a los estudiantes para reportar novedades en su trayecto, y brinda a las autoridades herramientas en tiempo real para tomar decisiones de prevención.
          </p>
          <div class="hero-actions">
            <button class="btn-primary-cta" @click="handleCTA">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              <span>{{ authStore.isAuthenticated ? 'Ir al Panel del Sistema' : 'Ingresar al Portal' }}</span>
            </button>
            <a href="#funcionalidades" class="btn-secondary-cta">
              Conocer más
            </a>
          </div>
          
          <div class="quick-credentials-hero" v-if="!authStore.isAuthenticated">
            <span class="cred-label">Ingreso de prueba rápido:</span>
            <div class="cred-tags">
              <span @click="fillAndRedirect('estudiante')" class="cred-tag-btn">Estudiante</span>
              <span @click="fillAndRedirect('autoridad')" class="cred-tag-btn admin">Autoridad</span>
            </div>
          </div>
        </div>

        <div class="hero-visual-content">
          <div class="interactive-radar-card">
            <div class="radar-header">
              <span class="radar-title">Vigilancia SafeCampus</span>
              <span class="radar-status pulsing-green">Servidor Activo</span>
            </div>
            
            <div class="radar-screen">
              <div class="radar-sweep"></div>
              <div class="radar-circle c1"></div>
              <div class="radar-circle c2"></div>
              <div class="radar-circle c3"></div>
              
              <!-- Puntos de Incidente en el Radar (Animados) -->
              <div class="radar-ping p1" data-label="Robo (Crítico)">
                <span class="ping-point critical"></span>
                <span class="ping-wave critical"></span>
              </div>
              <div class="radar-ping p2" data-label="Zona Oscura">
                <span class="ping-point warning"></span>
                <span class="ping-wave warning"></span>
              </div>
              <div class="radar-ping p3" data-label="Patrulla Activa">
                <span class="ping-point safe"></span>
                <span class="ping-wave safe"></span>
              </div>
              <div class="radar-ping center-school" data-label="U.E. Fe y Alegría">
                <div class="school-marker">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 5.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/></svg>
                </div>
              </div>
            </div>
            
            <div class="radar-legend">
              <div class="legend-item"><span class="dot critical"></span><span>Alerta Alta</span></div>
              <div class="legend-item"><span class="dot warning"></span><span>Riesgo Medio</span></div>
              <div class="legend-item"><span class="dot safe"></span><span>Zona Monitoreada</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- METRICS SECTION -->
    <section class="metrics-section">
      <div class="metrics-container">
        <div class="metric-card">
          <div class="metric-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="metric-info">
            <h3 class="metric-number">98.4%</h3>
            <p class="metric-text">Incidentes Atendidos</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon-box accent-red">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="metric-info">
            <h3 class="metric-number">+2,400</h3>
            <p class="metric-text">Alumnos Protegidos</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box accent-orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="metric-info">
            <h3 class="metric-number">5 Min</h3>
            <p class="metric-text">Tiempo de Respuesta</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box accent-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="metric-info">
            <h3 class="metric-number">Real-Time</h3>
            <p class="metric-text">Geolocalización Activa</p>
          </div>
        </div>
      </div>
    </section>

    <!-- KEY FEATURES SECTION -->
    <section id="funcionalidades" class="features-section">
      <div class="section-header">
        <h2 class="section-title">¿Qué ofrece SafeCampus Monitor?</h2>
        <p class="section-subtitle">
          Una solución robusta e inmediata enfocada en el cuidado mutuo de nuestra comunidad estudiantil.
        </p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon bg-red">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3>Reporte Geolocalizado</h3>
          <p>
            Los estudiantes seleccionan el punto exacto sobre el mapa de Leaflet para registrar hurtos, acoso escolar, áreas sin luminaria o cruces viales peligrosos en segundos.
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon bg-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h3>Categorización y Niveles</h3>
          <p>
            Clasifica cada incidente por nivel de severidad (Alta, Media, Baja) y jornada escolar. Esto ayuda a optimizar las rutas y planificar horarios escolares más seguros.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon bg-gradient">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="M14 14h3"/><path d="M14 18h3"/></svg>
          </div>
          <h3>Cuadro de Mando de Autoridades</h3>
          <p>
            Las autoridades escolares acceden a un centro de control con métricas en vivo, tablas de control de estado del incidente y mapas consolidados para la acción preventiva.
          </p>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE WALKTHROUGH SECTION -->
    <section class="walkthrough-section">
      <div class="walkthrough-container">
        <div class="walkthrough-info">
          <h2 class="section-title">¿Cómo funciona el sistema?</h2>
          <p class="section-subtitle">
            Un ciclo rápido de 3 pasos diseñado para la seguridad compartida en el entorno educativo.
          </p>

          <div class="steps-list">
            <div 
              class="step-item" 
              :class="{ active: activeStep === 1 }"
              @click="activeStep = 1"
            >
              <div class="step-number">1</div>
              <div class="step-text">
                <h4>Paso 1: Reporte del Estudiante</h4>
                <p>El estudiante marca sobre el mapa la novedad identificada y completa detalles rápidos.</p>
              </div>
            </div>

            <div 
              class="step-item" 
              :class="{ active: activeStep === 2 }"
              @click="activeStep = 2"
            >
              <div class="step-number">2</div>
              <div class="step-text">
                <h4>Paso 2: Procesamiento Instantáneo</h4>
                <p>El reporte es enviado en tiempo real y geolocalizado en el mapa general de incidencias.</p>
              </div>
            </div>

            <div 
              class="step-item" 
              :class="{ active: activeStep === 3 }"
              @click="activeStep = 3"
            >
              <div class="step-number">3</div>
              <div class="step-text">
                <h4>Paso 3: Monitoreo y Resolución</h4>
                <p>Las autoridades analizan la recurrencia y coordinan medidas correctivas e informativas.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="walkthrough-mockup">
          <div class="mockup-window glass-card">
            <div class="mockup-header">
              <div class="mockup-dots">
                <span class="m-dot red"></span>
                <span class="m-dot yellow"></span>
                <span class="m-dot green"></span>
              </div>
              <div class="mockup-address">safecampus.feyalegria.edu.ec</div>
            </div>
            
            <div class="mockup-body">
              <transition name="fade-slide" mode="out-in">
                <!-- STEP 1 VIEW -->
                <div v-if="activeStep === 1" key="step1" class="mockup-content">
                  <div class="mini-form">
                    <span class="form-title">Detalles del Reporte Escolar</span>
                    <div class="mini-field">
                      <label>Tipo de Incidente</label>
                      <div class="fake-select">Robo / Asalto</div>
                    </div>
                    <div class="mini-field">
                      <label>Severidad</label>
                      <div class="fake-select alert-red">Alta (Riesgo Crítico)</div>
                    </div>
                    <div class="mini-field">
                      <label>Ubicación</label>
                      <div class="fake-input">Lat: -0.2517, Lng: -78.5162</div>
                    </div>
                    <button type="button" class="btn-fake-submit">Enviar Reporte Seguro</button>
                  </div>
                </div>

                <!-- STEP 2 VIEW -->
                <div v-else-if="activeStep === 2" key="step2" class="mockup-content">
                  <div class="mini-map-preview">
                    <div class="radar-sonar-sweep"></div>
                    <div class="map-grid"></div>
                    <div class="marker-container animate-bounce-marker">
                      <div class="marker-pin"></div>
                      <div class="marker-pulse"></div>
                    </div>
                    <span class="map-coordinates">Sincronizando coordenadas en vivo...</span>
                  </div>
                </div>

                <!-- STEP 3 VIEW -->
                <div v-else key="step3" class="mockup-content">
                  <div class="mini-dashboard">
                    <span class="dash-title">Panel de Control Docente</span>
                    <div class="dash-stats-grid">
                      <div class="dash-stat">
                        <span class="d-num">12</span>
                        <span class="d-lbl">Zonas Críticas</span>
                      </div>
                      <div class="dash-stat">
                        <span class="d-num green">98%</span>
                        <span class="d-lbl">Atendidas</span>
                      </div>
                    </div>
                    <div class="dash-list">
                      <div class="dash-list-item">
                        <span class="badge high">Crítico</span>
                        <span class="text">Robo - Sector Portón</span>
                      </div>
                      <div class="dash-list-item">
                        <span class="badge medium">Medio</span>
                        <span class="text">Luz apagada - Av. Principal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS SECTION -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2 class="section-title">Testimonios de la Comunidad</h2>
        <p class="section-subtitle">
          Lo que opinan los miembros de las unidades educativas Fe y Alegría.
        </p>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="quote-icon">“</div>
          <p class="testimonial-comment">
            Gracias al mapa de incidentes de SafeCampus, ahora sé exactamente cuáles esquinas evitar en mi camino a casa después de la jornada vespertina. Es una gran herramienta de prevención.
          </p>
          <div class="testimonial-user">
            <div class="user-avatar bg-red-light">CA</div>
            <div class="user-info">
              <h4 class="user-name">Carlos Andrade</h4>
              <p class="user-role">Estudiante de 3ro BGU</p>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="quote-icon">“</div>
          <p class="testimonial-comment">
            SafeCampus Monitor nos ha permitido recopilar datos precisos sobre problemas de alumbrado público y robos en los alrededores de la escuela. Hemos presentado estos informes a las autoridades locales.
          </p>
          <div class="testimonial-user">
            <div class="user-avatar bg-slate-light">CR</div>
            <div class="user-info">
              <h4 class="user-name">Dra. Carmen Ruiz</h4>
              <p class="user-role">Rectora / Autoridad</p>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="quote-icon">“</div>
          <p class="testimonial-comment">
            Como madre de familia, me da mucha tranquilidad saber que mi hija tiene un canal institucional directo para reportar cualquier irregularidad en el campus y que las autoridades pueden verlo de inmediato.
          </p>
          <div class="testimonial-user">
            <div class="user-avatar bg-red-accent">SP</div>
            <div class="user-info">
              <h4 class="user-name">Sofía Pérez</h4>
              <p class="user-role">Madre de Familia / EGB Básica</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT FORM SECTION -->
    <section class="contact-section">
      <div class="contact-container glass-card">
        <div class="contact-info">
          <h2>¿Tienes dudas o deseas sumarte?</h2>
          <p>
            Envíanos tus comentarios, dudas o solicitudes de implementación para otras unidades de la red Fe y Alegría. Respondemos en menos de 24 horas.
          </p>
          <div class="contact-details">
            <div class="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>contacto@feyalegria.edu.ec</span>
            </div>
            <div class="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+593 (02) 2345-678</span>
            </div>
            <div class="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Quito, Ecuador</span>
            </div>
          </div>
        </div>

        <div class="contact-form-wrapper">
          <form @submit.prevent="handleContactSubmit" class="contact-form" novalidate>
            <div v-if="formSubmitted" class="success-toast fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <div>
                <strong>¡Mensaje Enviado!</strong>
                <p>Hemos recibido tus datos con éxito. Nos pondremos en contacto pronto.</p>
              </div>
            </div>

            <div class="form-group-home">
              <label for="nombre">Nombre Completo</label>
              <input 
                type="text" 
                id="nombre" 
                v-model="form.nombre" 
                placeholder="Ingresa tu nombre"
                :class="{ 'is-invalid': formErrors.nombre }"
              />
              <span class="error-msg" v-if="formErrors.nombre">{{ formErrors.nombre }}</span>
            </div>

            <div class="form-group-home">
              <label for="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                placeholder="ejemplo@correo.com"
                :class="{ 'is-invalid': formErrors.email }"
              />
              <span class="error-msg" v-if="formErrors.email">{{ formErrors.email }}</span>
            </div>

            <div class="form-group-home">
              <label for="rol">¿Cuál es tu rol?</label>
              <select id="rol" v-model="form.rol">
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="DOCENTE">Docente / Autoridad</option>
                <option value="FAMILIA">Madre/Padre de Familia</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div class="form-group-home">
              <label for="mensaje">Mensaje o Consulta</label>
              <textarea 
                id="mensaje" 
                v-model="form.mensaje" 
                rows="4" 
                placeholder="Escribe tu consulta aquí..."
                :class="{ 'is-invalid': formErrors.mensaje }"
              ></textarea>
              <span class="error-msg" v-if="formErrors.mensaje">{{ formErrors.mensaje }}</span>
            </div>

            <button type="submit" class="btn-submit-home">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </section>

    <!-- FOOTER SECTION -->
    <footer class="footer-section">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo-box">
            <!-- Corazón de Fe y Alegría en pequeño -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="28" height="28">
              <path d="M50 85 C-5 45 15 10 50 38 C85 10 105 45 50 85 Z" fill="#dc2626"/>
            </svg>
            <span class="footer-title">SafeCampus Monitor</span>
          </div>
          <p class="footer-brand-desc">
            Tecnología social para el cuidado mutuo de estudiantes de Fe y Alegría.
          </p>
        </div>

        <div class="footer-links">
          <div class="link-column">
            <h4>Sistema</h4>
            <router-link to="/login">Acceso de Usuarios</router-link>
            <a href="#funcionalidades">Características</a>
            <a href="#funcionalidades">Cómo Funciona</a>
          </div>
          <div class="link-column">
            <h4>Institución</h4>
            <a href="https://www.feyalegria.org" target="_blank" rel="noopener">Fe y Alegría Oficial</a>
            <a href="#">Políticas de Privacidad</a>
            <a href="#">Términos de Uso</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 SafeCampus - Fe y Alegría Ecuador. Todos los derechos reservados.</p>
        <div class="tech-stack-badges">
          <span class="badge-tech">Vue 3</span>
          <span class="badge-tech">Leaflet</span>
          <span class="badge-tech">Pinia</span>
          <span class="badge-tech">Vite</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

// Pasos interactivos
const activeStep = ref(1)

// Datos del formulario de contacto
const form = ref({
  nombre: '',
  email: '',
  rol: 'ESTUDIANTE',
  mensaje: ''
})
const formSubmitted = ref(false)
const formErrors = ref({})

// Función para rellenar campos y redireccionar rápido en el hero
const fillAndRedirect = async (roleType) => {
  // Cerramos sesión por si acaso para no causar conflictos de middleware
  authStore.logout()
  
  try {
    if (roleType === 'estudiante') {
      await authStore.login('estudiante@feyalegria.edu.ec', 'Estudiante123')
      router.push({ name: 'estudiante' })
    } else {
      await authStore.login('autoridad@feyalegria.edu.ec', 'AdminSeguridad123')
      router.push({ name: 'autoridad' })
    }
  } catch (err) {
    console.error('Error al iniciar sesión rápida:', err)
  }
}

// Validación de email básico
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Gestión del formulario de contacto
const handleContactSubmit = () => {
  formErrors.value = {}
  let isValid = true

  if (!form.value.nombre.trim()) {
    formErrors.value.nombre = 'El nombre es obligatorio'
    isValid = false
  }
  if (!form.value.email.trim()) {
    formErrors.value.email = 'El correo electrónico es obligatorio'
    isValid = false
  } else if (!validateEmail(form.value.email)) {
    formErrors.value.email = 'El formato del correo es inválido'
    isValid = false
  }
  if (!form.value.mensaje.trim()) {
    formErrors.value.mensaje = 'Por favor, escribe un mensaje'
    isValid = false
  }

  if (isValid) {
    formSubmitted.value = true
    // Resetear formulario tras unos segundos
    setTimeout(() => {
      formSubmitted.value = false
      form.value = {
        nombre: '',
        email: '',
        rol: 'ESTUDIANTE',
        mensaje: ''
      }
    }, 4000)
  }
}

// Acción principal de botón Hero
const handleCTA = () => {
  if (authStore.isAuthenticated) {
    if (authStore.userRole === 'AUTORIDAD') {
      router.push({ name: 'autoridad' })
    } else {
      router.push({ name: 'estudiante' })
    }
  } else {
    router.push({ name: 'login' })
  }
}
</script>

<style scoped>
.home-view {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--dark-color);
  background-color: var(--bg-body);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* HERO SECTION */
.hero-section {
  padding: 6rem 2rem 4rem 2rem;
  background: radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.07) 0%, rgba(15, 23, 42, 0.02) 100%), var(--bg-body);
  border-bottom: 1px solid var(--border-color);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 4rem;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--accent-light);
  color: var(--primary-color);
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.hero-text-content h1 {
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: var(--dark-color);
  margin-bottom: 1.25rem;
}

.highlight-text {
  background: linear-gradient(120deg, var(--primary-color) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--dark-light);
  line-height: 1.6;
  margin-bottom: 2.25rem;
  max-width: 580px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.btn-primary-cta {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.95rem 1.85rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--btn-shadow);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
}

.btn-primary-cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow-hover);
}

.btn-secondary-cta {
  text-decoration: none;
  color: var(--dark-light);
  border: 1px solid var(--border-color);
  background-color: white;
  border-radius: 12px;
  padding: 0.95rem 1.85rem;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-secondary-cta:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: var(--dark-color);
}

.quick-credentials-hero {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  background-color: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  width: fit-content;
}

.cred-label {
  font-weight: 600;
  color: var(--dark-light);
}

.cred-tags {
  display: flex;
  gap: 0.5rem;
}

.cred-tag-btn {
  background: var(--accent-light);
  color: var(--primary-color);
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(220, 38, 38, 0.12);
}

.cred-tag-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.cred-tag-btn.admin {
  background: #f1f5f9;
  color: var(--dark-color);
  border-color: #cbd5e1;
}

.cred-tag-btn.admin:hover {
  background: var(--dark-color);
  color: white;
}

/* INTERACTIVE RADAR Mockup Card */
.hero-visual-content {
  display: flex;
  justify-content: center;
}

.interactive-radar-card {
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: var(--glass-shadow);
  border-radius: 24px;
  padding: 1.5rem;
  width: 100%;
  max-width: 440px;
  position: relative;
}

.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.radar-title {
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

.radar-status {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.pulsing-green::before {
  content: '';
  width: 6px;
  height: 6px;
  background-color: var(--success-color);
  border-radius: 50%;
  display: inline-block;
  animation: pulse-dot 1s infinite;
}

.radar-screen {
  background-color: #0b0f19;
  border-radius: 16px;
  height: 280px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.05);
}

.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, rgba(220, 38, 38, 0.15) 0%, transparent 50%);
  transform-origin: 0 0;
  border-radius: 50%;
  animation: sweep 4s linear infinite;
  margin-top: -125px;
  margin-left: -125px;
  pointer-events: none;
}

@keyframes sweep {
  to { transform: rotate(360deg); }
}

.radar-circle {
  border: 1px solid rgba(220, 38, 38, 0.08);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.radar-circle.c1 { width: 80px; height: 80px; }
.radar-circle.c2 { width: 160px; height: 160px; }
.radar-circle.c3 { width: 240px; height: 240px; }

.radar-ping {
  position: absolute;
  cursor: pointer;
}

.radar-ping::after {
  content: attr(data-label);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(15, 23, 42, 0.95);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  margin-bottom: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.radar-ping:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

.ping-point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}

.ping-wave {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  top: -7px;
  left: -7px;
  animation: ping-expand 2s infinite ease-out;
  border: 1px solid currentColor;
}

@keyframes ping-expand {
  0% { transform: scale(0.3); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

.radar-ping.p1 { top: 25%; left: 30%; color: var(--primary-color); }
.radar-ping.p1 .ping-point { background-color: var(--primary-color); }
.radar-ping.p2 { top: 60%; left: 75%; color: var(--warning-color); }
.radar-ping.p2 .ping-point { background-color: var(--warning-color); }
.radar-ping.p3 { top: 70%; left: 25%; color: var(--success-color); }
.radar-ping.p3 .ping-point { background-color: var(--success-color); }

.radar-ping.center-school {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.school-marker {
  background-color: var(--primary-color);
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px var(--primary-color);
  animation: school-pulse 2s infinite;
}

@keyframes school-pulse {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

.radar-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.85rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dark-light);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.legend-item .dot.critical { background-color: var(--primary-color); }
.legend-item .dot.warning { background-color: var(--warning-color); }
.legend-item .dot.safe { background-color: var(--success-color); }

/* METRICS SECTION */
.metrics-section {
  background-color: white;
  padding: 3rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.metrics-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
}

.metric-icon-box {
  background-color: var(--accent-light);
  color: var(--primary-color);
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(220, 38, 38, 0.08);
}

.metric-icon-box.accent-red {
  background-color: #fee2e2;
  color: var(--primary-color);
}

.metric-icon-box.accent-orange {
  background-color: #ffedd5;
  color: var(--warning-color);
}

.metric-icon-box.accent-dark {
  background-color: #f1f5f9;
  color: var(--dark-color);
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-number {
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--dark-color);
  letter-spacing: -0.03em;
}

.metric-text {
  font-size: 0.85rem;
  color: var(--dark-light);
  font-weight: 500;
}

/* KEY FEATURES SECTION */
.features-section {
  padding: 6rem 2rem;
  background-color: var(--bg-body);
  border-bottom: 1px solid var(--border-color);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--dark-color);
  margin-bottom: 0.75rem;
}

.section-subtitle {
  color: var(--dark-light);
  font-size: 1rem;
  line-height: 1.5;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.feature-card {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(220, 38, 38, 0.04), 0 10px 10px -5px rgba(220, 38, 38, 0.02);
  border-color: rgba(220, 38, 38, 0.15);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon.bg-red {
  background-color: var(--accent-light);
  color: var(--primary-color);
}

.feature-icon.bg-dark {
  background-color: #f1f5f9;
  color: var(--dark-color);
}

.feature-icon.bg-gradient {
  background-color: #fff1f2;
  color: var(--accent-color);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.feature-card p {
  color: var(--dark-light);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* INTERACTIVE WALKTHROUGH */
.walkthrough-section {
  padding: 6rem 2rem;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
}

.walkthrough-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5rem;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.step-item {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item:hover {
  background-color: rgba(15, 23, 42, 0.015);
}

.step-item.active {
  background-color: var(--bg-body);
  border-color: var(--border-color);
  box-shadow: 0 4px 10px rgba(0,0,0,0.01);
}

.step-number {
  background-color: #cbd5e1;
  color: var(--dark-light);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.25);
}

.step-text h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.25rem;
}

.step-text p {
  font-size: 0.875rem;
  color: var(--dark-light);
  line-height: 1.4;
}

/* Walkthrough Mockup Viewport */
.walkthrough-mockup {
  display: flex;
  justify-content: center;
}

.mockup-window {
  width: 100%;
  max-width: 440px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--glass-shadow);
  overflow: hidden;
}

.mockup-header {
  background-color: #f1f5f9;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.mockup-dots {
  display: flex;
  gap: 0.35rem;
  margin-right: 1.5rem;
}

.m-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.m-dot.red { background-color: #ef4444; }
.m-dot.yellow { background-color: #f59e0b; }
.m-dot.green { background-color: #10b981; }

.mockup-address {
  font-size: 0.7rem;
  color: #94a3b8;
  background-color: white;
  padding: 0.15rem 2rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  text-align: center;
  flex: 1;
  font-family: monospace;
}

.mockup-body {
  padding: 1.75rem;
  height: 310px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mockup Step 1 Styles */
.mini-form {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.form-title {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.85rem;
  color: var(--dark-color);
}

.mini-field {
  margin-bottom: 0.65rem;
}

.mini-field label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--dark-light);
  text-transform: uppercase;
  margin-bottom: 0.2rem;
  display: block;
}

.fake-select, .fake-input {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
  font-size: 0.75rem;
  background-color: #f8fafc;
  color: var(--dark-color);
}

.fake-select.alert-red {
  background-color: var(--accent-light);
  color: var(--primary-color);
  border-color: rgba(220, 38, 38, 0.1);
  font-weight: 700;
}

.btn-fake-submit {
  width: 100%;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.45rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.5rem;
  cursor: default;
}

/* Mockup Step 2 Styles */
.mini-map-preview {
  width: 100%;
  height: 100%;
  background-color: #0b0f19;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.map-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(220, 38, 38, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220, 38, 38, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.radar-sonar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse-dot 2s infinite ease-in-out;
}

.marker-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.animate-bounce-marker {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-10px); }
}

.marker-pin {
  width: 14px;
  height: 14px;
  border-radius: 50% 50% 50% 0;
  background: var(--primary-color);
  transform: rotate(-45deg);
  box-shadow: -1px 1px 4px rgba(0,0,0,0.5);
}

.marker-pulse {
  position: absolute;
  width: 18px;
  height: 18px;
  left: -2px;
  top: -2px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: ping-expand 2s infinite ease-out;
}

.map-coordinates {
  position: absolute;
  bottom: 8px;
  left: 8px;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.6);
  font-family: monospace;
}

/* Mockup Step 3 Styles */
.mini-dashboard {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.dash-title {
  font-weight: 800;
  font-size: 0.8rem;
  color: var(--dark-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.4rem;
  display: block;
}

.dash-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.dash-stat {
  background-color: #f8fafc;
  border: 1px solid var(--border-color);
  padding: 0.4rem;
  border-radius: 8px;
  text-align: center;
}

.dash-stat .d-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary-color);
  display: block;
  line-height: 1;
}

.dash-stat .d-num.green {
  color: var(--success-color);
}

.dash-stat .d-lbl {
  font-size: 0.55rem;
  color: var(--dark-light);
  font-weight: 600;
}

.dash-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.dash-list-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  background-color: #f8fafc;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.dash-list-item .badge {
  font-size: 0.5rem;
  font-weight: 700;
  padding: 0.1rem 0.25rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.dash-list-item .badge.high {
  background-color: var(--accent-light);
  color: var(--primary-color);
}

.dash-list-item .badge.medium {
  background-color: #ffedd5;
  color: var(--warning-color);
}

.dash-list-item .text {
  font-weight: 500;
  color: var(--dark-light);
}

/* TESTIMONIALS SECTION */
.testimonials-section {
  padding: 6rem 2rem;
  background-color: var(--bg-body);
  border-bottom: 1px solid var(--border-color);
}

.testimonials-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.testimonial-card {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-2px);
}

.quote-icon {
  font-size: 4rem;
  color: rgba(220, 38, 38, 0.08);
  font-family: Georgia, serif;
  position: absolute;
  top: 10px;
  left: 20px;
  line-height: 1;
}

.testimonial-comment {
  font-size: 0.925rem;
  color: var(--dark-light);
  line-height: 1.6;
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
  font-style: italic;
}

.testimonial-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.user-avatar.bg-red-light {
  background-color: var(--accent-light);
  color: var(--primary-color);
}

.user-avatar.bg-slate-light {
  background-color: #f1f5f9;
  color: var(--dark-color);
}

.user-avatar.bg-red-accent {
  background-color: #fee2e2;
  color: var(--accent-color);
}

.user-info .user-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.1rem;
}

.user-info .user-role {
  font-size: 0.75rem;
  color: var(--dark-light);
  font-weight: 500;
}

/* CONTACT FORM SECTION */
.contact-section {
  padding: 6rem 2rem;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
}

.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.90fr 1.10fr;
  background-color: white;
  border: 1px solid var(--border-color);
  box-shadow: var(--glass-shadow);
  border-radius: 28px;
  overflow: hidden;
}

.contact-info {
  background: linear-gradient(135deg, var(--dark-color), #1e293b);
  color: white;
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contact-info h2 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.contact-info p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 3rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.detail-item svg {
  color: var(--accent-color);
  flex-shrink: 0;
}

.contact-form-wrapper {
  padding: 3.5rem;
  position: relative;
}

.success-toast {
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.success-toast svg {
  color: var(--success-color);
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.success-toast strong {
  font-size: 0.9rem;
  display: block;
}

.success-toast p {
  font-size: 0.775rem;
  margin-top: 0.15rem;
}

.form-group-home {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group-home label {
  font-size: 0.775rem;
  font-weight: 700;
  color: var(--dark-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group-home input,
.form-group-home select,
.form-group-home textarea {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group-home input:focus,
.form-group-home select:focus,
.form-group-home textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08);
}

.form-group-home input.is-invalid,
.form-group-home textarea.is-invalid {
  border-color: var(--primary-color);
  background-color: #fef2f2;
}

.error-msg {
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-submit-home {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  box-shadow: var(--btn-shadow);
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.btn-submit-home:hover {
  transform: translateY(-1px);
  box-shadow: var(--btn-shadow-hover);
}

/* FOOTER SECTION */
.footer-section {
  background-color: #0f172a;
  color: white;
  padding: 5rem 2rem 2.5rem 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.footer-logo-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.footer-brand-desc {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 320px;
}

.footer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.link-column h4 {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
  margin-bottom: 1.25rem;
}

.link-column a {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: color 0.2s;
}

.link-column a:hover {
  color: var(--accent-color);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #64748b;
}

.tech-stack-badges {
  display: flex;
  gap: 0.5rem;
}

.badge-tech {
  background-color: rgba(255,255,255,0.05);
  color: #94a3b8;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Transición animada suave para descripción y tabs */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Float Animation */
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .hero-text-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-actions {
    justify-content: center;
  }
  .quick-credentials-hero {
    margin-left: auto;
    margin-right: auto;
  }
  .metrics-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .features-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  .walkthrough-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .walkthrough-info {
    text-align: center;
  }
  .steps-list {
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
  .testimonials-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  .contact-container {
    grid-template-columns: 1fr;
  }
  .contact-info {
    padding: 2.5rem;
    gap: 2rem;
  }
  .contact-form-wrapper {
    padding: 2.5rem;
  }
  .footer-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: 4rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .hero-text-content h1 {
    font-size: 2.15rem;
  }
  .hero-description {
    font-size: 1rem;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .btn-primary-cta, .btn-secondary-cta {
    width: 100%;
    justify-content: center;
  }
  .metrics-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .features-section, .walkthrough-section, .testimonials-section, .contact-section {
    padding: 4rem 1rem;
  }
  .section-title {
    font-size: 1.75rem;
  }
  .mockup-window {
    max-width: 100%;
  }
  .mockup-body {
    padding: 1rem;
    height: 290px;
  }
  .footer-section {
    padding: 3rem 1.25rem 2rem 1.25rem;
  }
  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 1.25rem;
    text-align: center;
  }
}
</style>
