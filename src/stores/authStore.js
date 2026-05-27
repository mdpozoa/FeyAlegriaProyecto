import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const error = ref(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.rol || null)
  const userName = computed(() => user.value?.nombre || 'Usuario')
  const userEducationLevel = computed(() => user.value?.nivel_educativo || '')
  const userGradeCourse = computed(() => user.value?.grado_curso || '')

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      // Simulación de llamada a API (con datos semilla específicos de Fe y Alegría)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const formattedEmail = email.toLowerCase().trim()
          
          if (formattedEmail === 'estudiante@feyalegria.edu.ec' && password === 'Estudiante123') {
            const mockToken = 'jwt-carlos-bachillerato-token'
            const mockUser = { 
              id: 'u1', 
              nombre: 'Carlos Andrade', 
              email: formattedEmail, 
              rol: 'ESTUDIANTE',
              nivel_educativo: 'Bachillerato',
              grado_curso: '3ro BGU "A"'
            }
            token.value = mockToken
            user.value = mockUser
            localStorage.setItem('token', mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))
            resolve(mockUser)
          } else if (formattedEmail === 'estudiante.basica@feyalegria.edu.ec' && password === 'Estudiante123') {
            const mockToken = 'jwt-sofia-basica-token'
            const mockUser = { 
              id: 'u2', 
              nombre: 'Sofía Pérez', 
              email: formattedEmail, 
              rol: 'ESTUDIANTE',
              nivel_educativo: 'Básica',
              grado_curso: '9no EGB "B"'
            }
            token.value = mockToken
            user.value = mockUser
            localStorage.setItem('token', mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))
            resolve(mockUser)
          } else if (formattedEmail === 'autoridad@feyalegria.edu.ec' && password === 'AdminSeguridad123') {
            const mockToken = 'jwt-carmen-autoridad-token'
            const mockUser = { 
              id: 'u3', 
              nombre: 'Dra. Carmen Ruiz', 
              email: formattedEmail, 
              rol: 'AUTORIDAD',
              nivel_educativo: null,
              grado_curso: null
            }
            token.value = mockToken
            user.value = mockUser
            localStorage.setItem('token', mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))
            resolve(mockUser)
          } else {
            error.value = 'El correo electrónico o la contraseña ingresada son incorrectos'
            reject(new Error(error.value))
          }
        }, 800)
      })
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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    error,
    isLoading,
    isAuthenticated,
    userRole,
    userName,
    userEducationLevel,
    userGradeCourse,
    login,
    logout
  }
})
