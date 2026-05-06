<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-header">
        <h3>TOTAL REPORTES</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color)"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      </div>
      <p class="stat-value">{{ store.totalIncidents }}</p>
    </div>
    
    <div class="stat-card critical">
      <div class="stat-header">
        <h3>ZONAS CRÍTICAS</h3>
      </div>
      <p class="stat-value danger">{{ store.criticalZones }}</p>
    </div>

    <div class="stat-card warning">
      <div class="stat-header">
        <h3>ÚLTIMO INCIDENTE</h3>
      </div>
      <p class="stat-value">{{ store.latestIncident }}</p>
    </div>
  </div>
</template>

<script setup>
import { useIncidentStore } from '../stores/incidentStore'
const store = useIncidentStore()
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  border-left: 4px solid var(--primary-color);
}

.stat-card.critical {
  border-left-color: var(--danger-color);
}

.stat-card.warning {
  border-left-color: var(--warning-color);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.stat-value.danger {
  color: var(--danger-color);
}
</style>
