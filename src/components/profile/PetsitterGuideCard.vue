<script setup lang="ts">
import { ref } from 'vue'
import { Pencil } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

const props = defineProps<{
  profile: Profile | null
}>()

defineEmits<{
  generate: []
  'show-guide': []
}>()

// 선택된 가이드 대상 ('펫시터', '수의사', '유치원')
const selectedTarget = ref('기본') // 기본값 설정
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- profile이 존재하고 petsitterGuide가 있는 경우 -->
    <div
      v-if="profile?.petsitterGuide"
      class="bg-white rounded-lg p-6 shadow-dang-sm border border-_gray-100"
    >
      <div class="flex items-center gap-3 mb-4">
        <Pencil class="w-6 h-6 text-_green-500" />
        <h3 class="text-xl font-bold text-_gray-800">생성된 가이드</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold text-_green-500 mb-2">
            {{ profile.name }}의
            {{
              selectedTarget === '기본'
                ? '펫시터 가이드'
                : `${selectedTarget} 가이드`
            }}
          </h4>
          <p class="text-_gray-600 leading-relaxed line-clamp-2">
            {{ profile.petsitterGuide }}
          </p>
        </div>
      </div>

      <!-- 가이드 상세보기 버튼 -->
      <button
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-_green-500 text-white rounded-lg hover:bg-_green-600 transition-colors"
        @click="$emit('show-guide')"
      >
        <Pencil class="w-5 h-5" />
        가이드 상세보기
      </button>
    </div>

    <!-- profile이 없거나 petsitterGuide가 없을 경우 -->
    <div v-else class="text-center py-8">
      <p class="text-_gray-600 mb-4">
        아직 가이드가 생성되지 않았습니다.
      </p>

      <!-- 라디오 버튼으로 가이드 대상 선택 -->
      <div class="flex justify-center gap-4 mb-6 flex-wrap">
        <label
          v-for="option in ['펫시터', '수의사', '유치원', '기본']"
          :key="option"
          class="relative flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors"
          :class="{
            'border-dang-primary ring-2 ring-dang-primary bg-dang-primary/10':
              selectedTarget === option,
            'border-_gray-200 bg-white hover:ring-2 hover:ring-dang-primary':
              selectedTarget !== option,
          }"
        >
          <input
            type="radio"
            name="guide-target"
            :value="option"
            v-model="selectedTarget"
            class="sr-only"
          />
          <span class="text-sm font-medium text-_gray-700">{{ option }}</span>
        </label>
      </div>

      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-_green-500 text-white rounded-lg hover:bg-_green-600 transition-colors"
        @click="$emit('generate')"
      >
        <Pencil class="w-5 h-5" />
        {{ selectedTarget }} 가이드 생성하기
      </button>
    </div>
  </div>
</template>
