<template>
  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <!-- Background layer -->
    <div
      class="absolute w-full h-full top-0 left-0 z-10"
      :style="{ transform: `translateY(${scrollY * 0.1}px)` }"
    >
      <div
        class="absolute w-[600px] h-[600px] rounded-full bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      ></div>
    </div>

    <!-- Content layer -->
    <div
      class="absolute w-full h-full top-0 left-0 z-20 flex items-center justify-center"
      :style="{ transform: `translateY(${scrollY * -0.2}px)` }"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center p-8 max-w-[600px]"
      >
        <img
          src="@/assets/svgs/title.svg"
          alt="댕댕로그"
          class="h-20 w-auto mx-auto mb-4"
        />
        <p class="text-xl md:text-2xl text-_black mb-8">
          소중한 반려견의 일상을 기록하세요
        </p>
        <router-link to="/diary-list">
          <button
            class="bg-primary text-white border-none py-4 px-8 rounded-full text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-primary/80 hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            시작하기
          </button>
        </router-link>
      </div>
    </div>

    <!-- Dog layer -->
    <div
      class="absolute w-full h-full top-0 left-0 z-10"
      :style="{
        transform: `translateY(${scrollY * -0.15}px) translateX(${scrollY * 0.05}px)`,
      }"
    >
      <img
        src="@/assets/svgs/dog1.svg"
        alt="강아지 일러스트"
        class="absolute w-[200px] h-auto bottom-[10%] right-[10%] transition-transform duration-500"
      />
    </div>

    <!-- Paw prints -->
    <template v-for="(paw, index) in paws" :key="index">
      <div
        class="absolute w-full h-full top-0 left-0 z-10"
        :style="{ transform: paw.transform(scrollY) }"
      >
        <img
          src="@/assets/svgs/paw1.svg"
          alt="발자국"
          class="absolute w-[100px] h-auto transition-transform"
          :class="[
            paw.class,
            { [`bounce-animation-delay-${index}`]: isAnimating },
          ]"
          :style="{
            top: paw.top,
            left: paw.left,
            right: paw.right,
            bottom: paw.bottom,
          }"
        />
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

defineProps<{
  scrollY: number
}>()

const isAnimating = ref(true)

// Define paw positions and transformations
const paws = [
  {
    top: '30%',
    left: '20%',
    transform: (scrollY: number) =>
      `translateY(${scrollY * -0.3}px) rotate(${scrollY * 0.05}deg)`,
    class: 'rotate-[-15deg]',
  },
  {
    bottom: '25%',
    left: '15%',
    transform: (scrollY: number) =>
      `translateY(${scrollY * -0.25}px) translateX(${scrollY * -0.1}px) rotate(${scrollY * -0.03}deg)`,
    class: 'rotate-[20deg]',
  },
  {
    top: '20%',
    right: '25%',
    transform: (scrollY: number) =>
      `translateY(${scrollY * -0.18}px) rotate(${scrollY * 0.02}deg)`,
    class: 'rotate-[15deg] w-[120px]',
  },
  {
    top: '40%',
    right: '30%',
    transform: (scrollY: number) =>
      `translateY(${scrollY * -0.22}px) translateX(${scrollY * 0.12}px) rotate(${scrollY * 0.04}deg)`,
    class: 'rotate-[25deg]',
  },
  {
    bottom: '35%',
    right: '20%',
    transform: (scrollY: number) =>
      `translateY(${scrollY * -0.28}px) translateX(${scrollY * -0.15}px) rotate(${scrollY * -0.05}deg)`,
    class: 'rotate-[-10deg]',
  },
]

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
  // Start the bouncing animation
  startBouncingAnimation()
})
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.bounce-animation {
  animation: bounce 1s ease infinite;
}

.bounce-animation-delay-0 {
  animation: bounce 1s ease infinite;
}

.bounce-animation-delay-1 {
  animation: bounce 1s ease 0.2s infinite;
}

.bounce-animation-delay-2 {
  animation: bounce 1s ease 0.4s infinite;
}

.bounce-animation-delay-3 {
  animation: bounce 1s ease 0.6s infinite;
}

.bounce-animation-delay-4 {
  animation: bounce 1s ease 0.8s infinite;
}
</style>
