import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../stores/session'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('../pages/Catalog.vue'),
  },
  {
    path: '/title/:id',
    name: 'title',
    component: () => import('../pages/Title.vue'),
  },
  {
    path: '/watch/:id',
    name: 'watch',
    component: () => import('../pages/Watch.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-list',
    name: 'my-list',
    component: () => import('../pages/MyList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/continue',
    name: 'continue',
    component: () => import('../pages/Continue.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (to.meta.requiresAuth && !session.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }
  return true
})

export default router
