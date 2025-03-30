<template>
  <div
    class="min-h-screen overflow-y-auto overflow-x-hidden perspective-[1px] scroll-smooth bg-'_gray-100'"
    @scroll="handleScroll"
    ref="mainContainer"
  >
    <SideMenu :isOpen="isMenuOpen" @toggleMenu="toggleMenu" />

    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLogin"
    />

    <HeroSection
      :scrollY="scrollY"
      class="pt-16"
      :displayText="displayText"
      :cursorBlink="cursorBlink"
    />

    <FeaturesSection :scrollY="scrollY" />

    <StartSection />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SideMenu from '@/components/landing/navigation/SideMenu.vue'
import LoginModal from '@/components/landing/modals/LoginModal.vue'
import HeroSection from '@/components/landing/sections/HeroSection.vue'
import FeaturesSection from '@/components/landing/sections/FeaturesSection.vue'
import StartSection from '@/components/landing/sections/StartSection.vue'

const scrollY = ref(0)
const mainContainer = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
const showLoginModal = ref(false)
const isLoggedIn = ref(false)

// 타이핑 애니메이션 관련 변수
const fullText = '소중한 당신의 반려동물 일상을 기록하세요'
const displayText = ref('')
const typingSpeed = 150 // 타이핑 속도 (ms)
const cursorBlink = ref(true)
let typingTimer: number | null = null
let cursorTimer: number | null = null

// 타이핑 애니메이션 시작
const startTypingAnimation = () => {
  let currentIndex = 0

  // 커서 깜빡임 효과
  cursorTimer = window.setInterval(() => {
    cursorBlink.value = !cursorBlink.value
  }, 500)

  // 타이핑 효과
  typingTimer = window.setInterval(() => {
    if (currentIndex < fullText.length) {
      displayText.value += fullText.charAt(currentIndex)
      currentIndex++
    } else {
      // 타이핑이 완료되면 타이머 정리
      if (typingTimer !== null) {
        clearInterval(typingTimer)
        typingTimer = null
      }

      // 타이핑이 끝난 후 3초 후에 다시 시작
      setTimeout(() => {
        displayText.value = ''
        startTypingAnimation()
      }, 3000)
    }
  }, typingSpeed)
}

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
  // 타이핑 애니메이션 시작
  startTypingAnimation()
})

onUnmounted(() => {
  if (mainContainer.value) {
    mainContainer.value.removeEventListener('scroll', handleScroll)
  }
  // 타이머 정리
  if (typingTimer !== null) {
    clearInterval(typingTimer)
  }
  if (cursorTimer !== null) {
    clearInterval(cursorTimer)
  }
})
</script>
