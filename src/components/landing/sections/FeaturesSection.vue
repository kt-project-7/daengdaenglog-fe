<template>
  <section class="relative py-24 px-8 bg-white z-30">
    <h2 class="text-3xl md:text-4xl text-primary font-bold text-center mb-16">
      댕댕로그와 함께하는 반려견 일상
    </h2>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="bg-'_gray-100' rounded-2xl p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
        :style="{
          transform: `translateY(${Math.max(0, (scrollY - (300 + index * 50)) * -0.1)}px)`,
        }"
      >
        <div class="text-5xl mb-4">{{ feature.icon }}</div>
        <h3 class="text-xl text-primary font-bold mb-4">{{ feature.title }}</h3>
        <p class="text-_black/80 leading-relaxed">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  scrollY: number
}>()

const features = [
  {
    icon: '📝',
    title: '일기 작성',
    description: '반려견의 하루를 기록하고 소중한 순간을 남겨보세요.',
  },
  {
    icon: '🌤️',
    title: '날씨 & 기분',
    description: '그날의 날씨와 반려견의 기분을 이모지로 표현해보세요.',
  },
  {
    icon: '✨',
    title: 'AI 추억 생성',
    description: '일기를 바탕으로 AI가 특별한 추억을 만들어드립니다.',
  },
  {
    icon: '🧠',
    title: 'DBTI 분석',
    description: '반려견의 성격을 분석하여 맞춤형 케어 가이드를 제공합니다.',
  },
]
</script>
