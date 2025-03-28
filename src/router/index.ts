import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/DiaryListView.vue'),
  },
  {
    path: '/write',
    name: 'diary-write',
    component: () => import('@/views/DiaryWriteView.vue'),
  },
  {
    path: '/diary/:id',
    name: 'diary-detail',
    component: () => import('@/views/DiaryDetailView.vue'),
    props: true,
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
