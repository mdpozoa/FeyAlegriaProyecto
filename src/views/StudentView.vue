<template>
  <div class="student-view fade-in">
    <!-- Banner de Bienvenida Personalizado (Fe y Alegría) -->
    <div class="banner">
      <div class="banner-content">
        <div class="student-badge-container">
          <span class="badge-role">Estudiante</span>
          <span class="badge-edu-level">{{ authStore.userEducationLevel }}</span>
          <span class="badge-grade">{{ authStore.userGradeCourse }}</span>
        </div>
        <h2>Bienvenido, {{ authStore.userName }}</h2>
        <p v-if="!seleccionando">Tu seguridad es nuestra prioridad. Reporta incidentes en tu trayecto escolar para generar rutas seguras.</p>
        <p v-else class="selection-alert">Modo Selección Activo: Haz clic en el mapa para marcar el punto exacto del incidente.</p>
      </div>
      
      <div class="banner-actions">
        <!-- Notificaciones de reportes revisados (Siempre Visible para guiar al usuario) -->
        <div class="notification-wrapper">
          <button class="btn-bell" @click="showNotificationsMenu = !showNotificationsMenu" title="Notificaciones de Reportes">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="bell-badge" v-if="activeNotifications.length > 0">{{ activeNotifications.length }}</span>
          </button>
          
          <div class="notification-dropdown glass-card" v-if="showNotificationsMenu">
            <div class="dropdown-header">
              <h4>Reportes Revisados</h4>
              <button v-if="activeNotifications.length > 0" @click="dismissAll" class="btn-clear-all">Limpiar</button>
            </div>
            <div class="dropdown-body">
              <div 
                v-for="notif in activeNotifications" 
                :key="notif.id" 
                class="notif-item"
              >
                <div class="notif-icon">🔔</div>
                <div class="notif-text">
                  <p>Tu reporte de <strong>{{ notif.tipo }}</strong> ha sido revisado por la directiva.</p>
                  <span class="notif-time">{{ notif.horaAprox }} - {{ notif.jornada }}</span>
                </div>
                <button @click="dismissNotification(notif.id)" class="btn-dismiss-item">&times;</button>
              </div>
              
              <!-- Estado vacío de notificaciones -->
              <div v-if="activeNotifications.length === 0" class="empty-notif-state">
                <p>No tienes notificaciones de reportes revisados por el momento.</p>
              </div>
            </div>
          </div>
        </div>

        <button v-if="!seleccionando" class="btn-report" @click="activarSeleccion">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          REPORTAR INCIDENTE
        </button>
        <button v-else class="btn-cancel" @click="cancelarSeleccion">
          CANCELAR SELECCIÓN
        </button>
      </div>
    </div>

    <!-- Sección del Mapa -->
    <div class="map-section" :class="{ 'seleccion-activa': seleccionando }">
      <div class="map-header">
        <h3 v-if="!seleccionando">Mapa de Incidentes Recientes en el Campus</h3>
        <h3 v-else class="pulsing-text">👆 Selecciona la ubicación haciendo clic sobre el mapa</h3>
      </div>
      <IncidentMap :allow-selection="seleccionando" @location-selected="handleLocationSelected" />
    </div>

    <!-- Modal de Reporte Premium -->
    <div class="modal-overlay" v-if="showModal" @click.self="cancelarReporte">
      <div class="modal-content glass-card">
        <div class="modal-header">
          <div class="header-title">
            <svg class="icon-danger" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <h3>Detalles del Reporte</h3>
          </div>
          <span class="location-badge">
            Coordenadas: {{ selectedLocation.lat.toFixed(5) }}, {{ selectedLocation.lng.toFixed(5) }}
          </span>
        </div>

        <form @submit.prevent="submitReport">
          <div class="form-group">
            <label>Tipo de Incidente</label>
            <select v-model="formData.tipo" required>
              <option value="Robo">Robo / Asalto</option>
              <option value="Acoso">Acoso / Hostigamiento</option>
              <option value="Zona Oscura">Falta de Iluminación / Zona Oscura</option>
              <option value="Infraestructura">Problema de Infraestructura</option>
              <option value="Otros">Otros (Especificar)</option>
            </select>
          </div>

          <!-- Campo de Descripción Condicional y Dinámico -->
          <transition name="fade-slide">
            <div class="form-group" v-if="formData.tipo === 'Otros'">
              <label>Descripción del Suceso <span class="asterisk">*</span></label>
              <textarea 
                v-model="formData.descripcion" 
                placeholder="Por favor, describe en detalle la situación observada..." 
                rows="3"
                required
              ></textarea>
            </div>
          </transition>

          <div class="form-group">
            <label>Nivel de Alerta / Severidad</label>
            <select v-model="formData.severidad" required>
              <option value="HIGH">Alta (Riesgo Crítico / Inmediato)</option>
              <option value="MEDIUM">Media (Riesgo Preventivo)</option>
              <option value="LOW">Baja (Informativo)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jornada del Incidente</label>
            <select v-model="formData.jornada" required>
              <option value="Matutina">Jornada Matutina</option>
              <option value="Vespertina">Jornada Vespertina</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel-modal" @click="cancelarReporte">Cancelar</button>
            <button 
              type="submit" 
              class="btn-submit" 
              :disabled="formData.tipo === 'Otros' && !formData.descripcion.trim()"
            >
              Enviar Reporte Seguro
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Alert de Revisión Emergente -->
    <transition name="fade-slide">
      <div class="toast-alert glass-card" v-if="showToast && latestReviewedNotif">
        <div class="toast-header-popup">
          <span class="toast-icon">🚨</span>
          <strong>Reporte Atendido</strong>
          <button @click="showToast = false" class="toast-close">&times;</button>
        </div>
        <p>Tu reporte de <strong>{{ latestReviewedNotif.tipo }}</strong> ha sido revisado y atendido por las autoridades.</p>
      </div>
    </transition>

    <!-- Toast Alert de Reporte Enviado con Éxito -->
    <transition name="fade-slide">
      <div class="toast-alert-success glass-card" v-if="showSubmitSuccess">
        <div class="toast-header-popup">
          <span class="toast-icon-success">✓</span>
          <strong>Reporte Enviado y Registrado</strong>
          <button @click="showSubmitSuccess = false" class="toast-close">&times;</button>
        </div>
        <p>Tu reporte de incidente ha sido registrado con éxito. Las autoridades escolares lo revisarán a la brevedad posible.</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import IncidentMap from '../components/IncidentMap.vue'
import { useIncidentStore } from '../stores/incidentStore'
import { useAuthStore } from '../stores/authStore'

const store = useIncidentStore()
const authStore = useAuthStore()

const showModal = ref(false)
const seleccionando = ref(false)
const selectedLocation = ref(null)

// Gestión de notificaciones locales de reportes revisados
const showNotificationsMenu = ref(false)
const dismissedNotifs = ref(JSON.parse(localStorage.getItem(`dismissed_notifs_${authStore.user?.id}`) || '[]'))

const activeNotifications = computed(() => {
  return store.incidents.filter(i => {
    return i.reporteroId === authStore.user?.id && 
           i.estado === 'Revisado' && 
           !dismissedNotifs.value.includes(i.id)
  })
})

const dismissNotification = (id) => {
  dismissedNotifs.value.push(id)
  localStorage.setItem(`dismissed_notifs_${authStore.user?.id}`, JSON.stringify(dismissedNotifs.value))
}

const dismissAll = () => {
  activeNotifications.value.forEach(n => {
    dismissedNotifs.value.push(n.id)
  })
  localStorage.setItem(`dismissed_notifs_${authStore.user?.id}`, JSON.stringify(dismissedNotifs.value))
  showNotificationsMenu.value = false
}

// Alertas emergentes (Toast Alert) en tiempo real
const showToast = ref(false)
const showSubmitSuccess = ref(false)
const latestReviewedNotif = ref(null)

watch(activeNotifications, (newVal, oldVal) => {
  const oldLength = oldVal ? oldVal.length : 0
  if (newVal.length > oldLength) {
    // Detectar cuál es el reporte nuevo
    const newItems = newVal.filter(item => !oldVal || !oldVal.some(o => o.id === item.id))
    if (newItems.length > 0) {
      latestReviewedNotif.value = newItems[0]
      showToast.value = true
      // Ocultar automáticamente tras 5 segundos
      setTimeout(() => {
        showToast.value = false
      }, 5000)
    }
  }
}, { deep: true })

const formData = ref({
  tipo: 'Robo',
  severidad: 'HIGH',
  jornada: 'Matutina',
  descripcion: ''
})

let pollInterval = null

onMounted(() => {
  if (store.incidents.length === 0) {
    store.fetchIncidents()
  }

  // Polling cada 4 segundos para actualizar incidentes y estados (soporte tiempo real multiventana)
  pollInterval = setInterval(() => {
    store.fetchIncidents()
  }, 4000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

const activarSeleccion = () => {
  seleccionando.value = true
}

const cancelarSeleccion = () => {
  seleccionando.value = false
  selectedLocation.value = null
}

const handleLocationSelected = (location) => {
  selectedLocation.value = location
  showModal.value = true
}

const cancelarReporte = () => {
  showModal.value = false
  seleccionando.value = false
  selectedLocation.value = null
  formData.value.descripcion = ''
}

const submitReport = async () => {
  const now = new Date()
  const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const newIncident = {
    tipo: formData.value.tipo,
    severidad: formData.value.severidad,
    jornada: formData.value.jornada,
    horaAprox: hora,
    latitud: selectedLocation.value.lat,
    longitud: selectedLocation.value.lng,
    reporteroId: authStore.user?.id || null,
    // Solo enviamos descripción si es del tipo 'Otros'
    descripcion: formData.value.tipo === 'Otros' ? formData.value.descripcion.trim() : null
  }

  await store.addIncident(newIncident)
  showModal.value = false
  seleccionando.value = false
  selectedLocation.value = null
  formData.value.descripcion = ''

  // Disparar toast de reporte enviado y registrado con éxito
  showSubmitSuccess.value = true
  setTimeout(() => {
    showSubmitSuccess.value = false
  }, 5000)
}
</script>

<style scoped>
.student-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 0.5rem;
}

/* Banner de Fe y Alegría */
.banner {
  background: white;
  border-radius: 16px;
  padding: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background-color: var(--primary-color);
}

.student-badge-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.badge-role {
  background: rgba(15, 23, 42, 0.08);
  color: var(--dark-color);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.badge-edu-level {
  background: var(--accent-light);
  color: var(--primary-color);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.badge-grade {
  background: #f1f5f9;
  color: var(--dark-light);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.banner-content h2 {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--dark-color);
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}

.banner-content p {
  color: var(--dark-light);
  font-size: 0.95rem;
}

.selection-alert {
  color: var(--primary-color) !important;
  font-weight: 700;
}

.btn-report {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.75rem;
  font-weight: 700;
  font-size: 0.925rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  box-shadow: var(--btn-shadow);
  flex-shrink: 0;
}

.btn-report:hover {
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow-hover);
}

.btn-cancel {
  background-color: white;
  color: var(--dark-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.85rem 1.75rem;
  font-weight: 700;
  font-size: 0.925rem;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.btn-cancel:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

/* Sección del Mapa */
.map-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.map-section.seleccion-activa {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.map-header {
  margin-bottom: 1rem;
}

.map-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--dark-color);
}

.pulsing-text {
  color: var(--primary-color) !important;
  animation: pulse 1.5s infinite;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

/* Modal e Input */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--dark-color);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.location-badge {
  font-size: 0.8rem;
  color: var(--dark-light);
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  display: inline-block;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--dark-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
  font-family: inherit;
  background-color: rgba(255, 255, 255, 0.8);
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  background-color: white;
}

.asterisk {
  color: var(--primary-color);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-cancel-modal {
  background-color: white;
  color: var(--dark-light);
  border: 1px solid var(--border-color);
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel-modal:hover {
  background-color: #f1f5f9;
}

.btn-submit {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: var(--btn-shadow);
  transition: all 0.3s;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: var(--btn-shadow-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Transición animada suave para descripción */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* SISTEMA DE NOTIFICACIONES DE LA CAMPANA */
.banner-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.notification-wrapper {
  position: relative;
  display: inline-block;
}

.btn-bell {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--dark-light);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}

.btn-bell:hover {
  background-color: #f8fafc;
  color: var(--primary-color);
  border-color: #cbd5e1;
}

.bell-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05);
  border-radius: 16px;
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
}

.dropdown-header {
  padding: 0.85rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  background-color: #f8fafc;
}

.dropdown-header h4 {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--dark-color);
  margin: 0;
}

.btn-clear-all {
  background: none;
  border: none;
  font-size: 0.725rem;
  font-weight: 700;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0;
}

.btn-clear-all:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.dropdown-body {
  max-height: 260px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.95rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  transition: background-color 0.2s;
}

.notif-item:hover {
  background-color: #f8fafc;
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-icon {
  font-size: 1.15rem;
  flex-shrink: 0;
}

.notif-text p {
  font-size: 0.8rem;
  color: var(--dark-color);
  line-height: 1.4;
  margin: 0 0 0.25rem 0;
}

.notif-time {
  font-size: 0.675rem;
  color: #94a3b8;
  font-weight: 600;
}

.btn-dismiss-item {
  background: none;
  border: none;
  font-size: 1.15rem;
  font-weight: 500;
  color: #94a3b8;
  cursor: pointer;
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  transition: color 0.2s;
  padding: 0;
  line-height: 1;
}

.btn-dismiss-item:hover {
  color: var(--primary-color);
}

/* ESTILOS DE TOAST ALERTS EMERGENTES */
.toast-alert {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 320px;
  background-color: white;
  border-left: 4px solid var(--success-color);
  padding: 1.25rem;
  box-shadow: var(--glass-shadow);
  z-index: 3000;
  border-radius: 8px 16px 16px 8px;
  border-top: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.toast-header-popup {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.toast-header-popup strong {
  font-size: 0.85rem;
  color: var(--dark-color);
  flex: 1;
  font-weight: 800;
}

.toast-icon {
  font-size: 1.1rem;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  line-height: 1;
}

.toast-close:hover {
  color: var(--primary-color);
}

.toast-alert p {
  font-size: 0.8rem;
  color: var(--dark-light);
  line-height: 1.4;
  margin: 0;
}

/* ESTILOS DE ÉXITO Y NOTIFICACIÓN VACÍA */
.empty-notif-state {
  padding: 1.5rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.775rem;
}

.toast-alert-success {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  width: 320px;
  background-color: white;
  border-left: 4px solid var(--success-color);
  padding: 1.25rem;
  box-shadow: var(--glass-shadow);
  z-index: 3000;
  border-radius: 8px 16px 16px 8px;
  border-top: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.toast-icon-success {
  background-color: #e6fbf1;
  color: var(--success-color);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
}
</style>
