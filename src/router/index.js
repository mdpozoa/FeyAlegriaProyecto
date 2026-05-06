import { createRouter, createWebHashHistory } from 'vue-router'
import StudentView from '../views/StudentView.vue'
import AuthorityView from '../views/AuthorityView.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
