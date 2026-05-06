<template>
  <header class="app-header">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      <h1>SafeCampus <span>| Monitor</span></h1>
    </div>
    <div class="nav-tabs">
      <router-link to="/estudiante" class="tab-btn" active-class="active">Estudiante</router-link>
      <router-link to="/autoridad" class="tab-btn" active-class="active">Autoridad</router-link>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.logo span {
  font-weight: 400;
  opacity: 0.8;
}

.nav-tabs {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.25rem;
  display: flex;
  gap: 0.25rem;
}

.tab-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.tab-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.tab-btn.active {
  background-color: var(--accent-color);
}
</style>
