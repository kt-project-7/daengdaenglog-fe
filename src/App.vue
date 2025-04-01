<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/landing/header/AppHeader.vue'
import SideMenu from '@/components/landing/navigation/SideMenu.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import AppFooter from '@/components/landing/footer/AppFooter.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const isMenuOpen = ref(false)
const authStore = useAuthStore()

authStore.initializeAuth()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogin = (token: string) => {
  authStore.login(token)

  if (authStore.pendingRoute) {
    router.push(authStore.pendingRoute.fullPath)
    authStore.clearPendingRoute()
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader
      :isLoggedIn="authStore.isAuthenticated"
      @showLogin="authStore.showLoginModal = true"
      @toggleMenu="toggleMenu"
    />

    <main class="flex-1 mt-16">
      <RouterView />
    </main>

    <SideMenu :isOpen="isMenuOpen" @toggleMenu="toggleMenu" />

    <LoginModal
      v-if="authStore.showLoginModal"
      @close="authStore.showLoginModal = false"
      @login="handleLogin"
    />

    <AppFooter />
  </div>
</template>

<style scoped></style>
