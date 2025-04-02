<script setup lang="ts">
import type { Profile } from '@/types/profile'
import { Pencil, Sparkles } from 'lucide-vue-next'

defineProps<{
  pet: Profile
}>()
</script>
<template>
  <div class="space-y-6" v-if="pet?.petsitterGuide">
    <div class="text-center mb-6">
      <div
        class="inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4"
      >
        <Pencil class="w-12 h-12 text-chart-category3" />
      </div>
      <h3 class="text-2xl font-bold text-chart-category3">
        {{ pet.name }}의 가이드
      </h3>
      <p class="text-lg text-_gray-500 mt-2">
        아래 내용은 {{ pet.name }}의 가이드입니다.
      </p>
    </div>

    <div
      class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20"
    >
      <h4 class="text-xl font-bold text-chart-category3 mb-4">기본 정보</h4>
      <p class="text-_gray-700 leading-relaxed text-lg">
        {{ pet.petsitterGuide }}
      </p>
    </div>

    <!-- 생성형 AI 콘텐츠 섹션 -->
    <div
      class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20"
    >
      <h4 class="text-xl font-bold text-chart-category3">AI 요약 가이드</h4>
      <p class="text-_gray-700 leading-relaxed text-lg">
        {{ '생성형 AI를 통해 맞춤형 펫시터 가이드를 생성해보세요.' }}
      </p>
    </div>
  </div>
</template>
