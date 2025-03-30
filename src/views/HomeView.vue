<template>
  <div
    class="min-h-screen overflow-y-auto overflow-x-hidden perspective-[1px] scroll-smooth bg-'_gray-100'"
    @scroll="handleScroll"
    ref="mainContainer"
  >
    <AppHeader
      :isLoggedIn="isLoggedIn"
      @showLogin="showLoginModal = true"
      @toggleMenu="toggleMenu"
    />

    <SideMenu :isOpen="isMenuOpen" @toggleMenu="toggleMenu" />

    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLogin"
    />

    <HeroSection :scrollY="scrollY" class="pt-16" />

    <FeaturesSection :scrollY="scrollY" />

    <StartSection />

    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/landing/header/AppHeader.vue'
import SideMenu from '@/components/landing/navigation/SideMenu.vue'
import LoginModal from '@/components/landing/modals/LoginModal.vue'
import HeroSection from '@/components/landing/sections/HeroSection.vue'
import FeaturesSection from '@/components/landing/sections/FeaturesSection.vue'
import StartSection from '@/components/landing/sections/StartSection.vue'
import AppFooter from '@/components/landing/footer/AppFooter.vue'

const scrollY = ref(0)
const mainContainer = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
const showLoginModal = ref(false)
const isLoggedIn = ref(false)

const handleScroll = () => {
  if (mainContainer.value) {
    scrollY.value = mainContainer.value.scrollTop
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogin = (success: boolean) => {
  if (success) {
    isLoggedIn.value = true
    showLoginModal.value = false
  }
}

onMounted(() => {
  if (mainContainer.value) {
    mainContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (mainContainer.value) {
    mainContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>
