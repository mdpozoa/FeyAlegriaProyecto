<template>
  <div class="login-container">
    <div class="glass-card">
      <div class="login-header">
        <div class="logo-container">
          <svg class="feyalegria-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
            <!-- Red Heart -->
            <path d="M50 85 C-5 45 15 10 50 38 C85 10 105 45 50 85 Z" fill="#dc2626"/>
            <!-- Children silhouettes in white -->
            <!-- Left Child -->
            <circle cx="36" cy="42" r="3.5" fill="white" />
            <path d="M36 46.5 C33.5 46.5 32 48.5 32 52 L32 59 C32 59.5 32.5 60 33 60 C33.5 60 34 59.5 34 59 L34 54.5 L35 54.5 L35 65 C35 65.5 35.5 66 36 66 C36.5 66 37 65.5 37 65 L37 54.5 L38 54.5 L38 65 C38 65.5 38.5 66 39 66 C39.5 66 40 65.5 40 65 L40 52 C40 48.5 38.5 46.5 36 46.5 Z" fill="white" />
            <!-- Middle Child -->
            <circle cx="50" cy="42" r="3.5" fill="white" />
            <path d="M50 46.5 C47.5 46.5 46 48.5 46 52 L46 59 C46 59.5 46.5 60 47 60 C47.5 60 48 59.5 48 59 L48 54.5 L49 54.5 L49 65 C49 65.5 49.5 66 50 66 C50.5 66 51 65.5 51 65 L51 54.5 L52 54.5 L52 65 C52 65.5 52.5 66 53 66 C53.5 66 54 65.5 54 65 L54 52 C54 48.5 52.5 46.5 50 46.5 Z" fill="white" />
            <!-- Right Child -->
            <circle cx="64" cy="42" r="3.5" fill="white" />
            <path d="M64 46.5 C61.5 46.5 60 48.5 60 52 L60 59 C60 59.5 60.5 60 61 60 C61.5 60 62 59.5 62 59 L62 54.5 L63 54.5 L63 65 C63 65.5 63.5 66 64 66 C64.5 66 65 65.5 65 65 L65 54.5 L66 54.5 L66 65 C66 65.5 66.5 66 67 66 C67.5 66 68 65.5 68 65 L68 52 C68 48.5 66.5 46.5 64 46.5 Z" fill="white" />
            <!-- Holding hands lines -->
            <path d="M38 51 L44 51 M52 51 L58 51" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            <!-- Small white arches for feet details -->
            <path d="M35.5 54.2 C35.5 54.2 35.8 54.5 36.5 54.2" stroke="white" stroke-width="0.8" fill="none" />
            <path d="M49.5 54.2 C49.5 54.2 49.8 54.5 50.5 54.2" stroke="white" stroke-width="0.8" fill="none" />
            <path d="M63.5 54.2 C63.5 54.2 63.8 54.5 64.5 54.2" stroke="white" stroke-width="0.8" fill="none" />
          </svg>
        </div>
        <h2>SafeCampus</h2>
        <p class="subtitle">Movimiento de Educación Popular Integral</p>
        <span class="brand-tag">Fe y Alegría</span>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Institucional</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8z"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="estudiante@feyalegria.edu.ec" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <div v-if="authStore.error" class="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16.01"/></svg>
          <span>{{ authStore.error }}</span>
        </div>

        <button type="submit" class="btn-login" :disabled="authStore.isLoading">
          <span v-if="!authStore.isLoading">Ingresar al Portal</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div class="login-footer">
        <div class="divider"></div>
        <p class="creds-title">Credenciales de Acceso Rápido:</p>
        <div class="creds-box">
          <div><strong>Estudiante Bachillerato:</strong><br><code>estudiante@feyalegria.edu.ec</code> / <code>Estudiante123</code></div>
          <div style="margin-top: 0.5rem;"><strong>Estudiante Básica:</strong><br><code>estudiante.basica@feyalegria.edu.ec</code> / <code>Estudiante123</code></div>
          <div style="margin-top: 0.5rem;"><strong>Autoridad Docente:</strong><br><code>autoridad@feyalegria.edu.ec</code> / <code>AdminSeguridad123</code></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    const loggedUser = await authStore.login(email.value, password.value)
    if (loggedUser.rol === 'AUTORIDAD') {
      router.push({ name: 'autoridad' })
    } else {
      router.push({ name: 'estudiante' })
    }
  } catch (err) {
    // Manejado por el store de Pinia
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 8rem);
  background: radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.05) 0%, rgba(15, 23, 42, 0.02) 80%);
  padding: 1rem;
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: var(--glass-shadow);
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.feyalegria-logo {
  filter: drop-shadow(0 8px 16px rgba(220, 38, 38, 0.25));
  animation: heartBeat 2s infinite ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.08); }
  28% { transform: scale(1); }
  42% { transform: scale(1.08); }
  70% { transform: scale(1); }
}

.login-header h2 {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--dark-color);
  letter-spacing: -0.03em;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--dark-light);
  font-size: 0.85rem;
  font-weight: 500;
}

.brand-tag {
  display: inline-block;
  background: var(--accent-light);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-top: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--dark-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.75);
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  background-color: white;
}

.error-banner {
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: var(--primary-color);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.825rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
}

.btn-login {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--btn-shadow);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow-hover);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
}

.divider {
  height: 1px;
  background-color: var(--border-color);
  margin-bottom: 1.25rem;
}

.creds-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--dark-light);
  margin-bottom: 0.5rem;
  text-align: left;
  letter-spacing: 0.05em;
}

.creds-box {
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: var(--dark-light);
  text-align: left;
  line-height: 1.5;
}

.creds-box code {
  background: rgba(220, 38, 38, 0.06);
  color: var(--primary-color);
  padding: 0.1rem 0.25rem;
  border-radius: 4px;
  font-family: monospace;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
