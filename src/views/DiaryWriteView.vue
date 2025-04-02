<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiaryStore } from '@/stores/diaryStore'
import { usePetStore } from '@/stores/petStore'
import AddDiary from '@/components/diary/AddDiary.vue'
import type { CreateDiaryRequest } from '@/types/diary'
const router = useRouter()
const authStore = useAuthStore()
const diaryStore = useDiaryStore()
const petStore = usePetStore()
// 일기 저장
const saveDiary = async (payload: CreateDiaryRequest) => {
  try {
    const result = await diaryStore.addDiary(payload)
    console.log('일기 저장 성공:', result)
    router.push('/diary-list')
  } catch (error) {
    console.error('일기 저장 실패:', error)
    alert('일기를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 취소 처리
const handleCancel = () => {
  router.push('/diary-list')
}
</script>

<template>
  <div
    class="min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]"
  >
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- 타이틀 섹션 - 중앙 정렬 및 강조 -->
      <div class="text-center mb-10">
        <div class="inline-block relative">
          <h1 class="text-4xl font-bold text-dang-primary relative z-10">
            오늘의 댕댕이 관찰일기
          </h1>
          <div
            class="absolute -bottom-3 left-0 right-0 h-3 bg-chart-category3 opacity-30 rounded-full"
          ></div>

          <!-- 강아지 발자국 장식 -->
          <div
            class="absolute -top-6 -left-8 text-chart-category3 opacity-30 transform rotate-12"
          >
            🐾
          </div>
          <div
            class="absolute -bottom-6 -right-8 text-chart-category3 opacity-30 transform -rotate-12"
          >
            🐾
          </div>
        </div>
        <p class="mt-3 text-dang-secondary">
          소중한 반려견과의 하루를 기록해보세요
        </p>
      </div>

      <AddDiary
        :pet-id="petStore.currentPet.id"
        @submit="saveDiary"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
