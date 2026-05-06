import { createRouter, createWebHistory } from 'vue-router'
import StudentView from '../views/StudentView.vue'
import AuthorityView from '../views/AuthorityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/estudiante'
    },
    {
      path: '/estudiante',
      name: 'estudiante',
      component: StudentView
    },
    {
      path: '/autoridad',
      name: 'autoridad',
      component: AuthorityView
    }
  ]
})

export default router
