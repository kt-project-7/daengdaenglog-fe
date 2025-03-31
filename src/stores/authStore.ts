import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const showLoginModal = ref(false)
  const pendingRoute = ref<RouteLocationNormalized | null>(null)

  // 로그인 상태 초기화
  const initializeAuth = () => {
    const savedAuth = localStorage.getItem('isAuthenticated')
    isAuthenticated.value = savedAuth === 'true'
  }

  const login = () => {
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
    showLoginModal.value = false
  }

  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
  }

  const setPendingRoute = (route: RouteLocationNormalized) => {
    pendingRoute.value = route
  }

  const clearPendingRoute = () => {
    pendingRoute.value = null
  }

  // 초기 상태 설정
  initializeAuth()

  return {
    isAuthenticated,
    showLoginModal,
    pendingRoute,
    login,
    logout,
    initializeAuth,
    setPendingRoute,
    clearPendingRoute,
  }
})
