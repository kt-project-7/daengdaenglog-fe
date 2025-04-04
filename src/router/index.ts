import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/diary-list',
    name: 'diary-list',
    component: () => import('@/views/DiaryListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/diary-write',
    name: 'diary-write',
    component: () => import('@/views/DiaryWriteView.vue'),
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: '/dang-money-chart',
    name: 'dang-money-chart',
    component: () => import('@/views/DangMoneyChart.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dang-guide',
    name: 'dang-guide',
    component: () => import('@/views/GuideListView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 브라우저의 뒤로/앞으로 버튼을 사용한 경우 이전 위치로 이동
    if (savedPosition) {
      return savedPosition
    }

    // hash가 있으면 해당 요소로 스크롤
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 60, // 헤더가 있는 경우 헤더 높이만큼 여유 공간
      }
    }

    // 그 외에는 페이지 상단으로 스크롤
    return {
      top: 0,
      behavior: 'smooth',
    }
  },
})

// 보호된 라우트에 대한 네비게이션 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 로그인 상태 초기화
  authStore.initializeAuth()

  // 인증이 필요한 라우트인 경우
  if (to.meta.requiresAuth) {
    // 로그인되지 않은 경우
    if (!authStore.isAuthenticated) {
      // 원래 가려던 페이지 정보 저장
      authStore.setPendingRoute(to)
      // 로그인 모달을 표시하기 위해 상태 업데이트
      authStore.showLoginModal = true
      // 현재 라우트로 돌아가기
      next(false)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
