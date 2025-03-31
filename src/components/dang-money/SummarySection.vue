<template>
  <section
    class="relative h-[50vh] flex items-center justify-center overflow-hidden"
  >
    <div
      class="absolute w-full h-full top-0 left-0 z-[1]"
      :style="{ transform: `translateY(${scrollY * 0.1}px)` }"
    >
      <div
        class="absolute w-[37.5rem] h-[37.5rem] rounded-full bg-dang-primary opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      ></div>
    </div>

    <div
      class="absolute w-full h-full top-0 left-0 z-[5] flex items-center justify-center"
      :style="{ transform: `translateY(${scrollY * -0.2}px)` }"
    >
      <div class="text-center p-8 max-w-[50rem] relative z-10">
        <h1 class="text-4xl md:text-5xl text-dang-primary mb-4 font-bold">
          댕머니차트
        </h1>
        <p class="text-lg md:text-xl text-_gray-400 mb-8">
          반려견의 의료비와 지출 내역을 한눈에 확인하세요
        </p>
        <div
          class="flex flex-col md:flex-row justify-around gap-4 md:gap-8 mt-8"
        >
          <SummaryCard
            icon="DollarSign"
            title="총 지출"
            :value="store.formatCurrency(store.totalExpense)"
          />
          <SummaryCard
            icon="FileText"
            title="청구 건수"
            :value="`${store.claimCount}건`"
          />
          <SummaryCard
            icon="TrendingUp"
            title="환급률"
            :value="`${store.refundRate}%`"
          />
        </div>
      </div>
    </div>

    <!-- Dog image with bouncing animation -->
    <div
      class="absolute w-full h-full top-0 left-0 z-[3]"
      :style="{
        transform: `translateY(${scrollY * -0.15}px) translateX(${scrollY * 0.05}px)`,
      }"
    >
      <img
        src="@/assets/svgs/dog2.svg"
        alt="강아지 일러스트"
        class="absolute w-[7.5rem] md:w-[4.6875rem] h-auto bottom-[10%] right-[15%]"
      />
    </div>

    <!-- Paw prints with bouncing animation -->
    <div
      class="absolute w-full h-full top-0 left-0 z-[2]"
      :style="{
        transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * 0.05}deg)`,
      }"
    >
      <img
        src="@/assets/svgs/paw1.svg"
        alt="발자국"
        class="absolute w-[3.75rem] h-auto bottom-[40%] left-[20%] -rotate-[15deg] animate-bounce-delay-1 opacity-50"
        :class="{ 'animate-bounce-custom': isAnimating }"
      />
    </div>

    <div
      class="absolute w-full h-full top-0 left-0 z-[2]"
      :style="{
        transform: `translateY(${scrollY * -0.25}px) translateX(${scrollY * -0.1}px) rotate(${scrollY * -0.03}deg)`,
      }"
    >
      <img
        src="@/assets/svgs/paw1.svg"
        alt="발자국"
        class="absolute w-[3.75rem] h-auto bottom-[25%] left-[15%] rotate-[20deg] animate-bounce-delay-2 opacity-50"
        :class="{ 'animate-bounce-delay-1': isAnimating }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import SummaryCard from './SummaryCard.vue'

const store = useDangMoneyStore()

const scrollY = ref(0)
const isAnimating = ref(true)

defineProps<{
  scrollY: number
}>()

// Animation interval to toggle bouncing effect
const startBouncingAnimation = () => {
  setInterval(() => {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 1000)
  }, 3000)
}

onMounted(() => {
  // 바운싱 애니메이션 시작
  startBouncingAnimation()
})
</script>
