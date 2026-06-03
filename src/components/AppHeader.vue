<template>
  <header class="app-header">
    <router-link to="/" class="logo logo-link">
      <!-- SVG oficial de Fe y Alegría (Corazón y niños) -->
      <svg class="header-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
        <path d="M50 85 C-5 45 15 10 50 38 C85 10 105 45 50 85 Z" fill="white"/>
        <!-- Siluetas en rojo -->
        <circle cx="36" cy="42" r="3.5" fill="#dc2626" />
        <path d="M36 46.5 C33.5 46.5 32 48.5 32 52 L32 59 C32 59.5 32.5 60 33 60 C33.5 60 34 59.5 34 59 L34 54.5 L35 54.5 L35 65 C35 65.5 35.5 66 36 66 C36.5 66 37 65.5 37 65 L37 54.5 L38 54.5 L38 65 C38 65.5 38.5 66 39 66 C39.5 66 40 65.5 40 65 L40 52 C40 48.5 38.5 46.5 36 46.5 Z" fill="#dc2626" />
        <circle cx="50" cy="42" r="3.5" fill="#dc2626" />
        <path d="M50 46.5 C47.5 46.5 46 48.5 46 52 L46 59 C46 59.5 46.5 60 47 60 C47.5 60 48 59.5 48 59 L48 54.5 L49 54.5 L49 65 C49 65.5 49.5 66 50 66 C50.5 66 51 65.5 51 65 L51 54.5 L52 54.5 L52 65 C52 65.5 52.5 66 53 66 C53.5 66 54 65.5 54 65 L54 52 C54 48.5 52.5 46.5 50 46.5 Z" fill="#dc2626" />
        <circle cx="64" cy="42" r="3.5" fill="#dc2626" />
        <path d="M64 46.5 C61.5 46.5 60 48.5 60 52 L60 59 C60 59.5 60.5 60 61 60 C61.5 60 62 59.5 62 59 L62 54.5 L63 54.5 L63 65 C63 65.5 63.5 66 64 66 C64.5 66 65 65.5 65 65 L65 54.5 L66 54.5 L66 65 C66 65.5 66.5 66 67 66 C67.5 66 68 65.5 68 65 L68 52 C68 48.5 66.5 46.5 64 46.5 Z" fill="#dc2626" />
        <path d="M38 51 L44 51 M52 51 L58 51" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <h1>SafeCampus <span class="divider-text">|</span> <span class="brand-sub">Fe y Alegría</span></h1>
    </router-link>
    
    <div class="user-actions">
      <!-- Si está autenticado -->
      <template v-if="authStore.isAuthenticated">
        <!-- Botón dinámico para ir al Dashboard correspondiente desde la Landing -->
        <router-link 
          v-if="route.name === 'home'" 
          :to="authStore.userRole === 'AUTORIDAD' ? '/autoridad' : '/estudiante'"
          class="btn-dashboard-nav"
        >
          IR AL PANEL
        </router-link>

        <div class="user-profile-info">
          <span class="user-name">{{ authStore.userName }}</span>
          <!-- Badge de Segmentación Académica -->
          <span class="user-meta-badge" v-if="authStore.userRole === 'ESTUDIANTE'">
            {{ authStore.userEducationLevel }} • {{ authStore.userGradeCourse }}
          </span>
          <span class="user-meta-badge admin" v-else>
            Autoridad Educativa
          </span>
        </div>
        
        <button class="btn-logout" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          SALIR
        </button>
      </template>

      <!-- Si es invitado y no está en la página de login -->
      <template v-else-if="route.name !== 'login'">
        <router-link to="/login" class="btn-login-nav">
          INGRESAR
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  padding: 0.85rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-link {
  text-decoration: none;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.95;
}

.header-logo {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.logo h1 {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.divider-text {
  font-weight: 300;
  opacity: 0.5;
}

.brand-sub {
  font-weight: 400;
  font-size: 1.15rem;
  opacity: 0.9;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.user-profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
}

.user-name {
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
}

.user-meta-badge {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
}

.user-meta-badge.admin {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: 800;
}

.btn-login-nav, .btn-dashboard-nav {
  text-decoration: none;
  background-color: white;
  color: var(--primary-color);
  border: 1px solid white;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  font-weight: 700;
  font-size: 0.775rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-login-nav:hover, .btn-dashboard-nav:hover {
  background-color: var(--accent-light);
  border-color: var(--accent-light);
  color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-dashboard-nav {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-dashboard-nav:hover {
  background-color: white;
  color: var(--primary-color);
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.12);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-weight: 700;
  font-size: 0.775rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s;
  letter-spacing: 0.05em;
}

.btn-logout:hover {
  background-color: white;
  color: var(--primary-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .app-header {
    padding: 0.75rem 1rem;
  }
  .brand-sub {
    display: none;
  }
  .divider-text {
    display: none;
  }
  .user-profile-info {
    display: none; /* Oculta detalles en móviles pequeños para ganar espacio */
  }
  .btn-login-nav, .btn-dashboard-nav {
    padding: 0.4rem 0.75rem;
    font-size: 0.7rem;
  }
}
</style>
