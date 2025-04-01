<template>
  <section class="relative py-24 px-8 bg-dang-light z-30">
    <!-- 타이틀 섹션 - 중앙 정렬 및 밑줄 추가 -->
    <div class="text-center mb-16">
      <div class="inline-block relative">
        <h2 class="text-3xl md:text-4xl text-dang-primary font-bold relative z-10">
          댕댕로그와 함께하는 반려견 일상
        </h2>
        <div class="absolute -bottom-3 left-0 right-0 h-3 bg-chart-category3 opacity-30 rounded-full"></div>
      </div>
    </div>

    <div
      class="grid grid-cols-5 gap-4 max-w-7xl mx-auto"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="bg-dang-background rounded-2xl p-6 text-center shadow-dang-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
        :style="{
          transform: `translateY(${Math.max(0, (scrollY - (300 + index * 50)) * -0.1)}px)`,
        }"
      >
        <div class="text-4xl mb-3">{{ feature.icon }}</div>
        <h3 class="text-lg text-dang-primary font-bold mb-2">{{ feature.title }}</h3>
        <p class="text-sm text-_black/80 leading-relaxed">{{ feature.description }}</p>
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
    title: '다이어리 작성',
    description: '반려견의 하루를 기록하고 소중한 순간을 남겨보세요.',
  },
  {
    icon: '🤖',
    title: 'AI 추억 생성',
    description: '일기를 바탕으로 AI가 특별한 추억을 만들어드립니다.',
  },
  {
    icon: '🧠',
    title: 'DBTI 분석',
    description: '반려견의 성격을 분석하여 제공해드립니다.',
  },
  {
    icon: '🗒️',
    title: '댕가이드',
    description: '반려견의 정보를 종합적으로 분석하여 맞춤형 가이드를 제공합니다.',
  },
  {
    icon: '💰',
    title: '댕머니차트',
    description: '반려견의 보험정보를 한눈에 볼 수 있도록 제공합니다.',
  },
]
</script>