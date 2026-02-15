import { createRouter, createWebHistory } from 'vue-router'

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
  },
  {
    path: '/my-list',
    name: 'my-list',
    component: () => import('../pages/MyList.vue'),
  },
  {
    path: '/continue',
    name: 'continue',
    component: () => import('../pages/Continue.vue'),
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

export default router
