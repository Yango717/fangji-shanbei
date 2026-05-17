import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/learn',
    name: 'learn',
    component: () => import('../views/LearnView.vue')
  },
  {
    path: '/errors',
    name: 'error-book',
    component: () => import('../views/ErrorBookView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
