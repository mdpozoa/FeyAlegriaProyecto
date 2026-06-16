<template>
  <div class="login-container">
    <div class="glass-card">
      <!-- Logo -->
      <div class="login-header">
        <div class="logo-container">
          <svg class="feyalegria-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="72" height="72">
            <path d="M50 85 C-5 45 15 10 50 38 C85 10 105 45 50 85 Z" fill="#dc2626"/>
            <circle cx="36" cy="42" r="3.5" fill="white" />
            <path d="M36 46.5 C33.5 46.5 32 48.5 32 52 L32 59 C32 59.5 32.5 60 33 60 C33.5 60 34 59.5 34 59 L34 54.5 L35 54.5 L35 65 C35 65.5 35.5 66 36 66 C36.5 66 37 65.5 37 65 L37 54.5 L38 54.5 L38 65 C38 65.5 38.5 66 39 66 C39.5 66 40 65.5 40 65 L40 52 C40 48.5 38.5 46.5 36 46.5 Z" fill="white" />
            <circle cx="50" cy="42" r="3.5" fill="white" />
            <path d="M50 46.5 C47.5 46.5 46 48.5 46 52 L46 59 C46 59.5 46.5 60 47 60 C47.5 60 48 59.5 48 59 L48 54.5 L49 54.5 L49 65 C49 65.5 49.5 66 50 66 C50.5 66 51 65.5 51 65 L51 54.5 L52 54.5 L52 65 C52 65.5 52.5 66 53 66 C53.5 66 54 65.5 54 65 L54 52 C54 48.5 52.5 46.5 50 46.5 Z" fill="white" />
            <circle cx="64" cy="42" r="3.5" fill="white" />
            <path d="M64 46.5 C61.5 46.5 60 48.5 60 52 L60 59 C60 59.5 60.5 60 61 60 C61.5 60 62 59.5 62 59 L62 54.5 L63 54.5 L63 65 C63 65.5 63.5 66 64 66 C64.5 66 65 65.5 65 65 L65 54.5 L66 54.5 L66 65 C66 65.5 66.5 66 67 66 C67.5 66 68 65.5 68 65 L68 52 C68 48.5 66.5 46.5 64 46.5 Z" fill="white" />
            <path d="M38 51 L44 51 M52 51 L58 51" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
        <h2>SafeCampus</h2>
        <p class="subtitle">Movimiento de Educación Popular Integral</p>
        <span class="brand-tag">Fe y Alegría</span>
      </div>

      <!-- Tabs Login / Registro -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'; authStore.error = null"
        >
          Ingresar
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'; authStore.error = null"
        >
          Registrarse
        </button>
      </div>

      <!-- FORMULARIO LOGIN -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="login-email">Correo Electrónico</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8z"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input type="email" id="login-email" v-model="loginForm.email" placeholder="tu@correo.com" required autocomplete="email" />
          </div>
        </div>

        <div class="form-group">
          <label for="login-password">Contraseña</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input :type="showLoginPwd ? 'text' : 'password'" id="login-password" v-model="loginForm.password" placeholder="••••••••" required autocomplete="current-password" />
            <button type="button" class="eye-btn" @click="showLoginPwd = !showLoginPwd" tabindex="-1">
              <svg v-if="!showLoginPwd" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
          </div>
        </div>

        <div v-if="authStore.error" class="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16.01"/></svg>
          <span>{{ authStore.error }}</span>
        </div>

        <button type="submit" class="btn-login" :disabled="authStore.isLoading" id="btn-login-submit">
          <span v-if="!authStore.isLoading">Ingresar al Portal</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <!-- FORMULARIO REGISTRO -->
      <form v-else @submit.prevent="handleRegister" class="login-form">
        <div class="form-group">
          <label for="reg-nombre">Nombre Completo</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            <input type="text" id="reg-nombre" v-model="regForm.nombre" placeholder="Tu nombre completo" required autocomplete="name" />
          </div>
        </div>

        <div class="form-group">
          <label for="reg-email">Correo Electrónico</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8z"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input type="email" id="reg-email" v-model="regForm.email" placeholder="tu@correo.com" required autocomplete="email" />
          </div>
        </div>

        <div class="form-row-three">
          <div class="form-group">
            <label for="reg-nivel">Nivel Educativo</label>
            <select id="reg-nivel" v-model="regForm.nivelEducativo" required>
              <option value="Bachillerato">Bachillerato</option>
              <option value="Básica">Educación Básica</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reg-grado">Grado / Año</label>
            <select id="reg-grado" v-model="selectedGrado" required>
              <option v-for="g in gradosDisponibles" :key="g" :value="g">{{ g }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reg-paralelo">Paralelo</label>
            <select id="reg-paralelo" v-model="selectedParalelo" required>
              <option v-for="p in paralelosDisponibles" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="reg-password">Contraseña</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input :type="showRegPwd ? 'text' : 'password'" id="reg-password" v-model="regForm.password" placeholder="Mínimo 6 caracteres" required autocomplete="new-password" />
            <button type="button" class="eye-btn" @click="showRegPwd = !showRegPwd" tabindex="-1">
              <svg v-if="!showRegPwd" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="reg-password2">Confirmar Contraseña</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input :type="showRegPwd2 ? 'text' : 'password'" id="reg-password2" v-model="regForm.password2" placeholder="Repite tu contraseña" required autocomplete="new-password" />
            <button type="button" class="eye-btn" @click="showRegPwd2 = !showRegPwd2" tabindex="-1">
              <svg v-if="!showRegPwd2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
          </div>
        </div>

        <div v-if="regError" class="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16.01"/></svg>
          <span>{{ regError }}</span>
        </div>
        <div v-if="authStore.error" class="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16.01"/></svg>
          <span>{{ authStore.error }}</span>
        </div>

        <button type="submit" class="btn-login" :disabled="authStore.isLoading" id="btn-register-submit">
          <span v-if="!authStore.isLoading">Crear Cuenta de Estudiante</span>
          <span v-else class="loader"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('login')
const showLoginPwd = ref(false)
const showRegPwd = ref(false)
const showRegPwd2 = ref(false)
const regError = ref(null)

const loginForm = ref({ email: '', password: '' })
const regForm = ref({
  nombre: '',
  email: '',
  password: '',
  password2: '',
  nivelEducativo: 'Bachillerato',
  gradoCurso: ''
})

const selectedGrado = ref('')
const selectedParalelo = ref('A')

const gradosDisponibles = computed(() => {
  if (regForm.value.nivelEducativo === 'Bachillerato') {
    return ['1ro BGU', '2do BGU', '3ro BGU']
  } else {
    return ['8vo EGB', '9no EGB', '10mo EGB']
  }
})

const paralelosDisponibles = ['A', 'B', 'C', 'D', 'E', 'F']

watch(() => regForm.value.nivelEducativo, (newNivel) => {
  selectedGrado.value = newNivel === 'Bachillerato' ? '1ro BGU' : '8vo EGB'
}, { immediate: true })

const handleLogin = async () => {
  try {
    const user = await authStore.login(loginForm.value.email, loginForm.value.password)
    router.push(user.rol === 'AUTORIDAD' ? { name: 'autoridad' } : { name: 'estudiante' })
  } catch (err) {
    // Error manejado por el store
  }
}

const handleRegister = async () => {
  regError.value = null
  authStore.error = null
  if (regForm.value.password !== regForm.value.password2) {
    regError.value = 'Las contraseñas no coinciden'
    return
  }
  if (regForm.value.password.length < 6) {
    regError.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (!selectedGrado.value || !selectedParalelo.value) {
    regError.value = 'Por favor selecciona el Grado y Paralelo'
    return
  }

  regForm.value.gradoCurso = `${selectedGrado.value} "${selectedParalelo.value}"`

  try {
    const user = await authStore.register({
      nombre: regForm.value.nombre,
      email: regForm.value.email,
      password: regForm.value.password,
      nivelEducativo: regForm.value.nivelEducativo,
      gradoCurso: regForm.value.gradoCurso
    })
    router.push({ name: 'estudiante' })
  } catch (err) {
    // Error manejado por el store
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
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--glass-shadow);
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.login-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
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
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--dark-color);
  letter-spacing: -0.03em;
  margin-bottom: 0.2rem;
}

.subtitle {
  color: var(--dark-light);
  font-size: 0.82rem;
}

.brand-tag {
  display: inline-block;
  background: var(--accent-light);
  color: var(--primary-color);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.7rem;
  border-radius: 9999px;
  margin-top: 0.4rem;
}

/* TABS */
.tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.75rem;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 9px;
  padding: 0.6rem 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--dark-light);
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

/* FORM */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-row-three {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.78rem;
  font-weight: 700;
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
  padding: 0.7rem 2.5rem 0.7rem 2.4rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background-color: rgba(255,255,255,0.75);
  -webkit-appearance: none;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
  background-color: white;
}

.form-group select {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.75);
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  transition: all 0.3s;
}

.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
  background: white;
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.eye-btn:hover { color: var(--dark-color); }

.error-banner {
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: var(--primary-color);
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
}

.btn-login {
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--btn-shadow);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.25rem;
  min-height: 52px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow-hover);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader {
  width: 22px;
  height: 22px;
  border: 2.5px solid white;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile */
@media (max-width: 480px) {
  .glass-card {
    padding: 1.75rem 1.25rem;
    border-radius: 20px;
  }
  .form-row,
  .form-row-three {
    grid-template-columns: 1fr;
  }
}
</style>
