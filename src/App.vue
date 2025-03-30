<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/landing/header/AppHeader.vue'
import SideMenu from '@/components/landing/navigation/SideMenu.vue'
import LoginModal from '@/components/landing/modals/LoginModal.vue'
import AppFooter from '@/components/landing/footer/AppFooter.vue'

const router = useRouter()
const isMenuOpen = ref(false)
const showLoginModal = ref(false)
const isLoggedIn = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogin = (success: boolean) => {
  if (success) {
    isLoggedIn.value = true
    showLoginModal.value = false
  }
}

const handleNavigation = (
  page: 'diary-list' | 'profile' | 'diary-write' | 'dang-bti' | 'pet-guide',
) => {
  router.push(`/${page}`)
  if (isMenuOpen.value) {
    isMenuOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader
      :isLoggedIn="isLoggedIn"
      @showLogin="showLoginModal = true"
      @toggleMenu="toggleMenu"
    />

    <main class="flex-1 mt-[64px]">
      <RouterView />
    </main>

    <SideMenu :isOpen="isMenuOpen" @toggleMenu="toggleMenu" />

    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLogin"
    />

    <AppFooter />
  </div>
</template>

<style scoped></style>
