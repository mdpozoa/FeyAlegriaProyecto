<template>
  <div class="authority-view">
    <DashboardStats />
    <IncidentMap />
    <IncidentTable />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useIncidentStore } from '../stores/incidentStore'
import DashboardStats from '../components/DashboardStats.vue'
import IncidentMap from '../components/IncidentMap.vue'
import IncidentTable from '../components/IncidentTable.vue'

const store = useIncidentStore()

onMounted(() => {
  store.fetchIncidents()
})
</script>

<style scoped>
.authority-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
