<template>
  <div class="table-container">
    <div class="table-header">
      <div class="title">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color)"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <h2>Análisis de Incidentes Estudiantiles</h2>
      </div>
      <div class="actions">
        <button class="btn-dark" @click="exportData">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Exportar para Policía Nacional
        </button>
      </div>
    </div>
    
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>TIPO</th>
            <th>SEVERIDAD</th>
            <th>JORNADA</th>
            <th>HORA APROX.</th>
            <th>UBICACIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incident in store.incidents" :key="incident.id" class="table-row">
            <td class="font-medium">
              <span class="type-indicator" :class="{ 'other-type': incident.tipo === 'Otros' }">
                {{ incident.tipo }}
              </span>
            </td>
            <td>
              <span :class="['badge', incident.severidad.toLowerCase()]">
                {{ incident.severidad === 'HIGH' ? 'CRÍTICO' : incident.severidad === 'MEDIUM' ? 'PREVENTIVO' : 'BAJO' }}
              </span>
            </td>
            <td>{{ incident.jornada }}</td>
            <td>{{ incident.horaAprox }}</td>
            <td class="geo-coord">{{ incident.latitud.toFixed(4) }}, {{ incident.longitud.toFixed(4) }}</td>
            <td>
              <button @click="openDetails(incident)" class="action-btn">
                Ver Detalles
              </button>
            </td>
          </tr>
          <tr v-if="store.incidents.length === 0">
            <td colspan="6" class="empty-state">No hay incidentes reportados en esta sección.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalles del Incidente (UX Premium) -->
    <div class="modal-overlay" v-if="selectedIncident" @click.self="closeDetails">
      <div class="modal-content glass-card">
        <div class="modal-header">
          <div class="header-title">
            <svg class="icon-info" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12" y1="8" y2="8"/></svg>
            <h3>Detalle del Incidente</h3>
          </div>
          <button @click="closeDetails" class="close-x-btn">&times;</button>
        </div>

        <div class="details-body">
          <div class="detail-item">
            <span class="detail-label">Categoría</span>
            <span class="detail-val font-bold text-red">{{ selectedIncident.tipo }}</span>
          </div>

          <div class="detail-item" v-if="selectedIncident.descripcion">
            <span class="detail-label">Descripción Detallada</span>
            <div class="detail-description-box">
              {{ selectedIncident.descripcion }}
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Severidad</span>
              <span :class="['badge', selectedIncident.severidad.toLowerCase()]">
                {{ selectedIncident.severidad }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Jornada</span>
              <span class="detail-val">{{ selectedIncident.jornada }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hora Aproximada</span>
              <span class="detail-val">{{ selectedIncident.horaAprox }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ubicación Geo</span>
              <span class="detail-val font-mono">{{ selectedIncident.latitud.toFixed(6) }}, {{ selectedIncident.longitud.toFixed(6) }}</span>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
              <span class="detail-label">Estado de Revisión</span>
              <span :class="['status-badge', (selectedIncident.estado || 'Reportado').toLowerCase()]">
                {{ selectedIncident.estado || 'Reportado' }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            v-if="(selectedIncident.estado || 'Reportado') !== 'Revisado'" 
            @click="markAsReviewed(selectedIncident.id)" 
            class="btn-action-resolve"
          >
            Atender y Marcar como Revisado
          </button>
          <button @click="closeDetails" class="btn-close-modal">Cerrar Detalles</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIncidentStore } from '../stores/incidentStore'

const store = useIncidentStore()
const selectedIncident = ref(null)

const openDetails = (incident) => {
  selectedIncident.value = incident
}

const closeDetails = () => {
  selectedIncident.value = null
}

const markAsReviewed = async (id) => {
  await store.updateIncidentStatus(id, 'Revisado')
  selectedIncident.value = null // Cerrar modal al completar
}

const exportData = () => {
  if (store.incidents.length === 0) {
    alert('No hay incidentes registrados para exportar.')
    return
  }

  // Estructurar cabeceras en formato CSV compatible
  const headers = ['ID Reporte', 'Tipo Incidente', 'Nivel Severidad', 'Jornada Escolar', 'Hora Aproximada', 'Latitud', 'Longitud', 'Estado Actual', 'Detalles / Descripción']
  
  // Mapear filas con escape de comillas dobles
  const rows = store.incidents.map(i => [
    i.id,
    i.tipo,
    i.severidad === 'HIGH' ? 'CRÍTICO' : i.severidad === 'MEDIUM' ? 'PREVENTIVO' : 'BAJO',
    i.jornada,
    i.horaAprox,
    i.latitud,
    i.longitud,
    i.estado || 'Reportado',
    i.descripcion || 'Sin descripción'
  ])

  // Añadir BOM (Byte Order Mark) para soporte UTF-8 en Excel
  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  // Crear y disparar la descarga en el navegador de manera segura (evitando bloqueos de DOM)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `reporte_policia_nacional_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  
  // Liberar el elemento del DOM y revocar la URL después de que el navegador procese el clic
  setTimeout(() => {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, 150)
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--border-color);
  overflow: hidden;
  animation: fadeIn 0.4s ease-out;
}

.table-header {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title h2 {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
  color: var(--dark-color);
  letter-spacing: -0.02em;
}

.btn-dark {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border: none;
  background: var(--dark-color);
  color: white;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
}

.btn-dark:hover {
  background: var(--primary-color);
  box-shadow: var(--btn-shadow-hover);
  transform: translateY(-1px);
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  font-size: 0.725rem;
  font-weight: 700;
  color: var(--dark-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

td {
  padding: 1.15rem 1.5rem;
  font-size: 0.875rem;
  color: var(--dark-light);
  border-bottom: 1px solid var(--border-color);
}

.table-row {
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8fafc;
}

tr:last-child td {
  border-bottom: none;
}

.font-medium {
  font-weight: 700;
  color: var(--dark-color);
}

.type-indicator {
  display: inline-block;
}

.type-indicator.other-type {
  color: var(--primary-color);
  font-style: italic;
}

.geo-coord {
  font-family: monospace;
  font-size: 0.8rem;
  color: #64748b;
}

.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  display: inline-block;
  letter-spacing: 0.03em;
}

.badge.high {
  background-color: var(--accent-light);
  color: var(--primary-color);
}

.badge.medium {
  background-color: #ffedd5;
  color: #c2410c;
}

.badge.low {
  background-color: #e0f2fe;
  color: #0369a1;
}

.action-btn {
  background-color: #f1f5f9;
  border: 1px solid var(--border-color);
  color: var(--dark-color);
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.775rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--accent-light);
  color: var(--primary-color);
  border-color: rgba(220, 38, 38, 0.2);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-style: italic;
}

/* Modal e Info */
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

.close-x-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
}

.close-x-btn:hover {
  color: var(--primary-color);
}

.details-body {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.detail-label {
  font-size: 0.725rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-val {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark-color);
}

.text-red {
  color: var(--primary-color);
}

.font-bold {
  font-weight: 800;
}

.font-mono {
  font-family: monospace;
}

.detail-description-box {
  background-color: rgba(220, 38, 38, 0.03);
  border-left: 3px solid var(--primary-color);
  padding: 0.85rem 1rem;
  border-radius: 4px 8px 8px 4px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--dark-light);
}

.status-badge {
  font-size: 0.725rem;
  font-weight: 800;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  text-transform: uppercase;
  display: inline-block;
  letter-spacing: 0.03em;
  width: fit-content;
}

.status-badge.reportado {
  background-color: #e2e8f0;
  color: var(--dark-light);
  border: 1px solid var(--border-color);
}

.status-badge.revisado {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.btn-action-resolve {
  background-color: var(--success-color);
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
}

.btn-action-resolve:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.25);
}

.btn-close-modal {
  background-color: var(--dark-color);
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close-modal:hover {
  background-color: var(--primary-color);
}
</style>
