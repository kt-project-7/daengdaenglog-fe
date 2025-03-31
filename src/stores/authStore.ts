import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const accessToken = ref<string | null>(null)
  const showLoginModal = ref(false)
  const pendingRoute = ref<RouteLocationNormalized | null>(null)

  const initializeAuth = () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      isAuthenticated.value = true
      accessToken.value = token
    }
  }

  const login = (token: string) => {
    isAuthenticated.value = true
    accessToken.value = token
    localStorage.setItem('accessToken', token)
    showLoginModal.value = false
  }

  const logout = () => {
    isAuthenticated.value = false
    accessToken.value = null
    localStorage.removeItem('accessToken')
  }

  const setPendingRoute = (route: RouteLocationNormalized) => {
    pendingRoute.value = route
  }

  const clearPendingRoute = () => {
    pendingRoute.value = null
  }

  // 초기화
  initializeAuth()

  return {
    isAuthenticated,
    accessToken,
    showLoginModal,
    pendingRoute,
    login,
    logout,
    initializeAuth,
    setPendingRoute,
    clearPendingRoute,
  }
})
