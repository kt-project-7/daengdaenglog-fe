<script setup lang="ts">
import { ref, watch } from 'vue'
import { Brain } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

const props = defineProps<{
  profile: Profile | null
}>()

const emit = defineEmits<{
  analyze: []
  'show-result': []
}>()

const isAnalyzed = ref(false)

// 분석 버튼 눌렀을 때 실행되는 함수
const handleAnalyzeClick = () => {
  isAnalyzed.value = true
  emit('analyze')
}

// 반려동물 바뀌면 분석 초기화
watch(() => props.profile, () => {
  isAnalyzed.value = false
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 분석 결과가 보이도록 설정됐고 profile이 존재하며 pbti가 있는 경우 -->
    <div
      v-if="isAnalyzed && profile?.pbti"
      class="bg-white rounded-lg p-6 shadow-dang-sm border border-_gray-100"
    >
      <div class="flex items-center gap-3 mb-4">
        <Brain class="w-6 h-6 text-_blue-500" />
        <h3 class="text-xl font-bold text-_gray-800">DBTI 분석 결과</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold text-_blue-500 mb-2">
            {{ profile.pbti }}
          </h4>
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

    <!-- 분석 전 상태 -->
    <div v-else class="text-center py-8">
      <p class="text-_gray-600 mb-4">아직 DBTI 분석이 진행되지 않았습니다.</p>
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-_blue-500 text-white rounded-lg hover:bg-_blue-600 transition-colors"
        @click="handleAnalyzeClick"
      >
        <Brain class="w-5 h-5" />
        DBTI 분석하기
      </button>
    </div>
  </div>
</template>
