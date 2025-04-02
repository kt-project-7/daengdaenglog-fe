<script setup lang="ts">
import { ref, watch } from 'vue'
import { Brain } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'
import { fetchDbtiResult } from '@/apis/dbti'
import { usePetStore } from '@/stores/petStore'

const props = defineProps<{
  profile: Profile | null
}>()

const emit = defineEmits<{
  analyze: []
  'show-result': []
}>()

const petStore = usePetStore()
const isAnalyzed = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 분석 버튼 눌렀을 때 실행되는 함수
const handleAnalyzeClick = async () => {
  if (!props.profile) return

  isLoading.value = true
  error.value = null

  try {
    const data = await fetchDbtiResult(props.profile.id)
    console.log('DBTI 분석 결과 원본:', data)
    console.log('DBTI 분석 결과 결과값:', data.results)

    // 응답 데이터 형식 확인
    if (data.results === null) {
      console.error('DBTI 결과가 null입니다')
      petStore.updatePetPbti('ERROR')
    } else if (typeof data.results === 'string') {
      console.log('DBTI 결과가 문자열입니다:', data.results)
      petStore.updatePetPbti(data.results)
    } else if (typeof data.results === 'object') {
      console.log('DBTI 결과가 객체입니다:', data.results)
      // 객체인 경우 적절한 필드 추출
      petStore.updatePetPbti(JSON.stringify(data.results))
    } else {
      console.error('DBTI 결과 타입이 예상과 다릅니다:', typeof data.results)
      petStore.updatePetPbti(String(data.results))
    }

    console.log('설정된 PBTI 값:', props.profile.pbti)
    isAnalyzed.value = true
    emit('analyze')
  } catch (err) {
    console.error('DBTI 분석 중 오류 발생:', err)
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

    <div
      v-else-if="isLoading"
      class="flex flex-col items-center justify-center py-16 space-y-6"
    >
      <!-- 귀여운 로딩 이모지 -->
      <div class="text-4xl animate-bounce">🐶</div>

      <!-- 텍스트 + 이모지 조합 -->
      <p class="text-_gray-600 text-lg font-semibold animate-pulse">
        DBTI를 부지런히 분석 중이에요... ⏳
      </p>

      <!-- 둥글둥글 귀여운 도트 스피너 -->
      <div class="flex space-x-2">
        <div
          class="w-3 h-3 bg-_blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"
        ></div>
        <div
          class="w-3 h-3 bg-_blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"
        ></div>
        <div class="w-3 h-3 bg-_blue-400 rounded-full animate-bounce"></div>
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
