<template>
  <div class="table-container">
    <div class="table-header">
      <div class="title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color)"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <h2>Análisis de Datos Estudiantiles</h2>
      </div>
      <div class="actions">
        <button class="btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filtros
        </button>
        <button class="btn-dark">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Exportar para Policía
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
            <th>ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incident in store.incidents" :key="incident.id">
            <td class="font-medium">{{ incident.tipo }}</td>
            <td>
              <span :class="['badge', incident.severidad.toLowerCase()]">
                {{ incident.severidad }}
              </span>
            </td>
            <td>{{ incident.jornada }}</td>
            <td>{{ incident.horaAprox }}</td>
            <td><a href="#" class="action-link">Ver detalles</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useIncidentStore } from '../stores/incidentStore'
const store = useIncidentStore()
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-dark {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #1f2937;
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
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
  background-color: #f9fafb;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

tr:last-child td {
  border-bottom: none;
}

.font-medium {
  font-weight: 500;
  color: #111827;
}

.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.high {
  background-color: #fee2e2;
  color: #b91c1c;
}

.badge.medium {
  background-color: #ffedd5;
  color: #c2410c;
}

.action-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.action-link:hover {
  text-decoration: underline;
}
</style>
