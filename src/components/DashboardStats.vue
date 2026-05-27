<template>
  <div class="stats-grid">
    <!-- Card 1: Total Reportes -->
    <div class="stat-card">
      <div class="stat-header">
        <h3>TOTAL REPORTES</h3>
        <div class="icon-circle info">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
        </div>
      </div>
      <p class="stat-value">{{ store.totalIncidents }}</p>
      <span class="stat-sub">Reportes en el campus</span>
    </div>
    
    <!-- Card 2: Zonas Críticas -->
    <div class="stat-card critical">
      <div class="stat-header">
        <h3>ZONAS CRÍTICAS</h3>
        <div class="icon-circle danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
      </div>
      <p class="stat-value danger">{{ store.criticalZones }}</p>
      <span class="stat-sub danger-text">Requieren atención urgente</span>
    </div>

    <!-- Card 3: Último Incidente -->
    <div class="stat-card warning">
      <div class="stat-header">
        <h3>ÚLTIMO INCIDENTE</h3>
        <div class="icon-circle warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>
      <p class="stat-value font-type">{{ store.latestIncident }}</p>
      <span class="stat-sub warning-text">Último suceso reportado</span>
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  animation: fadeIn 0.4s ease-out;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -10px rgba(15, 23, 42, 0.08);
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
  margin-bottom: 0.75rem;
}

.stat-header h3 {
  font-size: 0.775rem;
  font-weight: 700;
  color: var(--dark-light);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.icon-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle.info {
  background-color: #eff6ff;
  color: #3b82f6;
}

.icon-circle.danger {
  background-color: var(--accent-light);
  color: var(--primary-color);
}

.icon-circle.warning {
  background-color: #fff7ed;
  color: var(--warning-color);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--dark-color);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.stat-value.font-type {
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--dark-color);
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}

.stat-value.danger {
  color: var(--primary-color);
}

.stat-sub {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 0.25rem;
}

.stat-sub.danger-text {
  color: var(--primary-color);
  font-weight: 600;
}

.stat-sub.warning-text {
  color: var(--warning-color);
  font-weight: 600;
}
</style>
