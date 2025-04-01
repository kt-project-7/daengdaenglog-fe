<script setup lang="ts">
import { Brain } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

const props = defineProps<{
  profile: Profile | null // profile이 null일 수 있음을 명시
}>()

defineEmits<{
  analyze: []
  'show-result': []
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- profile이 존재하고 dbtiResult가 있는 경우 -->
    <div v-if="profile?.dbtiResult" class="bg-white rounded-lg p-6 shadow-dang-sm border border-_gray-100">
      <div class="flex items-center gap-3 mb-4">
        <Brain class="w-6 h-6 text-_blue-500" />
        <h3 class="text-xl font-bold text-_gray-800">DBTI 분석 결과</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold text-_blue-500 mb-2">
            {{ profile.dbtiResult.type }}
          </h4>
          <p class="text-_gray-600 leading-relaxed line-clamp-2">
            {{ profile.dbtiResult.description }}
          </p>
        </div>
      </div>

      <!-- 결과 상세보기 버튼 -->
      <button
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-_blue-500 text-white rounded-lg hover:bg-_blue-600 transition-colors"
        @click="$emit('show-result')"
      >
        <Brain class="w-5 h-5" />
        결과 상세보기
      </button>
    </div>

    <!-- profile이 없거나 dbtiResult가 없을 경우 -->
    <div v-else class="text-center py-8">
      <p class="text-_gray-600 mb-4">아직 DBTI 분석이 진행되지 않았습니다.</p>
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-_blue-500 text-white rounded-lg hover:bg-_blue-600 transition-colors"
        @click="$emit('analyze')"
      >
        <Brain class="w-5 h-5" />
        DBTI 분석하기
      </button>
    </div>
  </div>
</template>
