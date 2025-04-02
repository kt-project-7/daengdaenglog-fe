<script setup lang="ts">
import { ref, watch } from 'vue'
import { Brain } from 'lucide-vue-next'
import axios from 'axios'
import type { Profile } from '@/types/profile'

const props = defineProps<{
  profile: Profile | null
}>()

const emit = defineEmits<{
  analyze: []
  'show-result': []
}>()

const isAnalyzed = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 분석 버튼 눌렀을 때 실행되는 함수
const handleAnalyzeClick = async () => {
  if (!props.profile) return

  isLoading.value = true
  error.value = null

  try {
    const response = await axios.get('https://dangdanglog.com/pet/pbti/1', {
      headers: {
        accept: '*/*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NDM1NzE1NzQsImV4cCI6MTc0MzYwNzU3NCwiaXNzIjoiY2xvdmVyIiwic3ViIjoiMSIsInJvbGUiOiJBRE1JTiJ9.hbbkrPnvBhDUuEPWD5EhxX-ycckAQDhasRahn8wTgBiFhWH5u_F32fZ1cTqhta4fWfyqs4N0btFCHLrmx86NuQ',
      },
    })

    // API 응답 처리 (여기서는 응답 데이터를 어떻게 처리할지에 대한 구체적인 정보가 없어 emit만 합니다)
    console.log('PBTI 분석 결과:', response.data)

    isAnalyzed.value = true
    emit('analyze')
    props.profile.pbti = response.data.results // 분석 결과를 profile에 저장
  } catch (err) {
    console.error('PBTI 분석 중 오류 발생:', err)
    error.value = '분석 중 오류가 발생했습니다. 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
}

// 반려동물 바뀌면 분석 초기화
watch(
  () => props.profile,
  () => {
    isAnalyzed.value = false
    error.value = null
  },
)
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
            {{ props.profile?.pbti }}
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

    <!-- 에러 메시지 표시 -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-_blue-500 text-white rounded-lg hover:bg-_blue-600 transition-colors"
        @click="handleAnalyzeClick"
      >
        <Brain class="w-5 h-5" />
        다시 시도하기
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div
      v-else-if="isLoading"
      class="flex flex-col items-center justify-center py-16 space-y-4"
    >
      <!-- 텍스트 애니메이션 -->
      <p class="text-_gray-600 text-lg font-medium animate-pulse">
        DBTI를 분석하는 중이에요...
      </p>

      <div class="relative w-12 h-12">
        <div
          class="absolute inset-0 border-4 border-_blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
        <div
          class="absolute inset-2 border-4 border-_blue-300 border-t-transparent rounded-full animate-spin-slow"
        ></div>
      </div>
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
