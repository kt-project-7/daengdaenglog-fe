<script setup lang="ts">
import type { Profile } from '@/types/profile'
import { Brain } from 'lucide-vue-next'

defineProps<{
  pet: Profile
}>()
</script>
<template>
  <div class="space-y-6" v-if="pet?.pbti">
    <div class="text-center mb-6">
      <div
        class="inline-block p-4 bg-chart-category2 bg-opacity-20 rounded-full mb-4"
      >
        <Brain class="w-12 h-12 text-chart-category2" />
      </div>
      <h3 class="text-2xl font-bold text-chart-category2">{{ pet.pbti }}</h3>
      <p class="text-lg text-_gray-500 mt-2">{{ pet.name }}의 DBTI 결과</p>
    </div>

    <div
      class="bg-chart-category2 bg-opacity-10 rounded-xl p-6 border border-chart-category2 border-opacity-20"
    >
      <h4 class="text-xl font-bold text-chart-category2 mb-4">성격 분석</h4>
      <p class="text-_gray-700 leading-relaxed text-lg">{{ pet.pbti }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div
        class="bg-dang-light rounded-xl p-5 border border-chart-category2 border-opacity-20"
      >
        <h4 class="text-lg font-bold text-chart-category2 mb-3">특징</h4>
        <ul class="space-y-2 text-_gray-600">
          <li class="flex items-start gap-2">
            <span
              class="inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2"
            ></span>
            활발하고 사교적인 성격
          </li>
          <li class="flex items-start gap-2">
            <span
              class="inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2"
            ></span>
            새로운 환경과 사람에 호기심이 많음
          </li>
          <li class="flex items-start gap-2">
            <span
              class="inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2"
            ></span>
            놀이와 활동에 대한 열정이 넘침
          </li>
        </ul>
      </div>

      <div
        class="bg-dang-light rounded-xl p-5 border border-chart-category3 border-opacity-20"
      >
        <h4 class="text-lg font-bold text-chart-category3 mb-3">양육 팁</h4>
        <ul class="space-y-2 text-_gray-600">
          <li class="flex items-start gap-2">
            <span
              class="inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2"
            ></span>
            충분한 운동과 놀이 시간 제공
          </li>
          <li class="flex items-start gap-2">
            <span
              class="inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2"
            ></span>
            다양한 사회화 경험 제공
          </li>
          <li class="flex items-start gap-2">
            <span
              class="inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2"
            ></span>
            일관된 규칙과 훈련 제공
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
