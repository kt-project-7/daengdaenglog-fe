<template>
  <div
    class="min-h-screen bg-dang-light overflow-y-auto overflow-x-hidden scroll-smooth"
    @scroll="handleScroll"
    ref="chartContainer"
  >
    <SummarySection :scrollY="scrollY" :isAnimating="isAnimating" />
    <ExpenseCharts />
    <ClaimsSection />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SummarySection from '@/components/dang-money/SummarySection.vue'
import ExpenseCharts from '@/components/dang-money/ExpenseCharts.vue'
import ClaimsSection from '@/components/dang-money/ClaimsSection.vue'

// 상태 관리
const chartContainer = ref<HTMLElement | null>(null)
const scrollY = ref(0)
const isAnimating = ref(true)

const handleScroll = () => {
  if (chartContainer.value) {
    scrollY.value = chartContainer.value.scrollTop
  }
}

// Animation interval to toggle bouncing effect
const startBouncingAnimation = () => {
  setInterval(() => {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 1000)
  }, 3000)
}

// 컴포넌트가 마운트될 때 이벤트 리스너 등록
onMounted(() => {
  if (chartContainer.value) {
    chartContainer.value.addEventListener('scroll', handleScroll)
  }

  // 바운싱 애니메이션 시작
  startBouncingAnimation()
})

// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
onUnmounted(() => {
  if (chartContainer.value) {
    chartContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.bg-grid {
  background-image:
    linear-gradient(#f3f3f3 1px, transparent 1px),
    linear-gradient(90deg, #f3f3f3 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
