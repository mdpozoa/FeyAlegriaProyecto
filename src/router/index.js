import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import LoginView from '../views/LoginView.vue'
import StudentView from '../views/StudentView.vue'
import AuthorityView from '../views/AuthorityView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/estudiante',
      name: 'estudiante',
      component: StudentView,
      meta: { requiresAuth: true, role: 'ESTUDIANTE' }
    },
    {
      path: '/autoridad',
      name: 'autoridad',
      component: AuthorityView,
      meta: { requiresAuth: true, role: 'AUTORIDAD' }
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuth = authStore.isAuthenticated
  const role = authStore.userRole

  // 1. Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuth) {
      // Redirigir a login si no está autenticado
      return next({ name: 'login' })
    }
    
    // Verificar si el rol es el adecuado
    if (to.meta.role && to.meta.role !== role) {
      // Redirigir a su vista autorizada por defecto según su rol
      return next(role === 'AUTORIDAD' ? { name: 'autoridad' } : { name: 'estudiante' })
    }
  }

  // 2. Si la ruta requiere ser invitado (ej. Login) y ya está autenticado
  if (to.meta.requiresGuest && isAuth) {
    return next(role === 'AUTORIDAD' ? { name: 'autoridad' } : { name: 'estudiante' })
  }

  next()
})

export default router
