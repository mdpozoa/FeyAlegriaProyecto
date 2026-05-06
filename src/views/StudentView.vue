<template>
  <div class="student-view">
    <div class="banner">
      <div class="banner-content">
        <h2>Tu seguridad es nuestra prioridad</h2>
        <p v-if="!seleccionando">Reporta incidentes en tu trayecto para generar rutas seguras.</p>
        <p v-else style="color: var(--danger-color); font-weight: 600;">Modo Selección: Haz clic en el mapa para marcar la ubicación del incidente.</p>
      </div>
      
      <button v-if="!seleccionando" class="btn-report" @click="activarSeleccion">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        REPORTAR INCIDENTE
      </button>
      <button v-else class="btn-cancel" @click="seleccionando = false">
        CANCELAR
      </button>
    </div>

    <!-- Mapa para el estudiante -->
    <div class="map-section" :class="{ 'selecion-activa': seleccionando }">
      <h3 v-if="!seleccionando">Mapa de Incidentes Recientes</h3>
      <h3 v-else style="color: var(--danger-color);">👆 Selecciona un punto en el mapa</h3>
      <IncidentMap :allow-selection="seleccionando" @location-selected="handleLocationSelected" />
    </div>

    <!-- Modal de Reporte -->
    <div class="modal-overlay" v-if="showModal" @click.self="cancelarReporte">
      <div class="modal-content">
        <h3>Detalles del Incidente</h3>
        <p style="margin-bottom: 1rem; font-size: 0.875rem; color: #6b7280;">
          Ubicación seleccionada: {{ selectedLocation.lat.toFixed(4) }}, {{ selectedLocation.lng.toFixed(4) }}
        </p>
        <form @submit.prevent="submitReport">
          <div class="form-group">
            <label>Tipo de Incidente</label>
            <select v-model="formData.tipo" required>
              <option value="Robo">Robo</option>
              <option value="Acoso">Acoso</option>
              <option value="Zona Oscura">Zona Oscura</option>
              <option value="Infraestructura">Problema de Infraestructura</option>
            </select>
          </div>
          <div class="form-group">
            <label>Severidad</label>
            <select v-model="formData.severidad" required>
              <option value="HIGH">Alta (Crítico)</option>
              <option value="MEDIUM">Media (Preventivo)</option>
              <option value="LOW">Baja</option>
            </select>
          </div>
          <div class="form-group">
            <label>Jornada</label>
            <select v-model="formData.jornada" required>
              <option value="Matutina">Matutina</option>
              <option value="Vespertina">Vespertina</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="cancelarReporte">Cancelar</button>
            <button type="submit" class="btn-submit">Confirmar y Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import IncidentMap from '../components/IncidentMap.vue'
import { useIncidentStore } from '../stores/incidentStore'

const store = useIncidentStore()

const showModal = ref(false)
const seleccionando = ref(false)
const selectedLocation = ref(null)

const formData = ref({
  tipo: 'Robo',
  severidad: 'HIGH',
  jornada: 'Matutina'
})

onMounted(() => {
  if (store.incidents.length === 0) {
    store.fetchIncidents()
  }
})

const activarSeleccion = () => {
  seleccionando.value = true
}

const handleLocationSelected = (location) => {
  selectedLocation.value = location
  showModal.value = true
}

const cancelarReporte = () => {
  showModal.value = false
  seleccionando.value = false
  selectedLocation.value = null
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
    longitud: selectedLocation.value.lng
  }

  await store.addIncident(newIncident)
  showModal.value = false
  seleccionando.value = false
  selectedLocation.value = null
}
</script>

<style scoped>
.student-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1rem;
}

.banner {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
}

.banner-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.banner-content p {
  color: #6b7280;
  font-size: 1rem;
}

.btn-report {
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-report:hover {
  background-color: #d84a00;
}

.btn-cancel {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.map-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.map-section.selecion-activa {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.2);
}

.map-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #111827;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #111827;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-submit:hover {
  background: var(--accent-color);
}
</style>
