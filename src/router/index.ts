import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
     {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register/Register.vue')
    },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("@/views/404/index.vue") // 直接渲染404组件
    }
  ],
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
