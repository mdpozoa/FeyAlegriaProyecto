import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('sc_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('sc_user') || 'null'))
  const error = ref(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.rol || null)
  const userName = computed(() => user.value?.nombre || 'Usuario')
  const userEducationLevel = computed(() => user.value?.nivel_educativo || '')
  const userGradeCourse = computed(() => user.value?.grado_curso || '')

  function setSession(data) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('sc_token', data.token)
    localStorage.setItem('sc_user', JSON.stringify(data.user))
  }

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')
      setSession(data)
      return data.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register({ nombre, email, password, nivelEducativo, gradoCurso }) {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email: email.toLowerCase().trim(), password, nivelEducativo, gradoCurso })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al registrarse')
      setSession(data)
      return data.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('sc_token')
    localStorage.removeItem('sc_user')
    // Limpiar también las notificaciones descartadas
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('dismissed_notifs_')) localStorage.removeItem(k)
    })
  }

  return {
    token, user, error, isLoading,
    isAuthenticated, userRole, userName, userEducationLevel, userGradeCourse,
    login, register, logout
  }
})
