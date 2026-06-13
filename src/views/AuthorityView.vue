<template>
  <div class="authority-view fade-in">
    <DashboardStats />
    <IncidentMap />
    <IncidentTable />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useIncidentStore } from '../stores/incidentStore'
import DashboardStats from '../components/DashboardStats.vue'
import IncidentMap from '../components/IncidentMap.vue'
import IncidentTable from '../components/IncidentTable.vue'

const store = useIncidentStore()

onMounted(async () => {
  await store.fetchIncidents()
  // SSE para tiempo real — autoridad ve los reportes al instante
  store.connectSSE()
})

onUnmounted(() => {
  store.disconnectSSE()
})
</script>

<style scoped>
.authority-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 768px) {
  .authority-view {
    gap: 1.25rem;
  }
}
</style>
