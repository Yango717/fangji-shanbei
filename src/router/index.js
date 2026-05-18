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
    path: '/study-setup',
    name: 'study-setup',
    component: () => import('../views/StudySetupView.vue'),
    props: route => ({ mode: route.query.mode || null })
  },
  {
    path: '/study',
    name: 'study',
    component: () => import('../views/StudyView.vue')
  },
  {
    path: '/deep-study-setup',
    name: 'deep-study-setup',
    component: () => import('../views/DeepStudySetupView.vue')
  },
  {
    path: '/deep-study',
    name: 'deep-study',
    component: () => import('../views/DeepStudyView.vue')
  },
  {
    path: '/study-complete',
    name: 'study-complete',
    component: () => import('../views/StudyCompleteView.vue')
  },
  {
    path: '/errors',
    name: 'error-book',
    component: () => import('../views/ErrorBookView.vue')
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('../views/PricingView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
