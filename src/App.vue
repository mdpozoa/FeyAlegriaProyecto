<template>
  <div class="app-wrapper">
    <AppHeader />
    <main :class="['main-content', { 'full-width': isLandingPage }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const isLandingPage = computed(() => route.name === 'home')
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-body);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  transition: all 0.3s ease;
}

.main-content.full-width {
  padding: 0;
  max-width: 100%;
  margin: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
  }
}
</style>
