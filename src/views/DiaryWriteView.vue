<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useDiaryStore } from '@/stores/diaryStore'
import { usePetStore } from '@/stores/petStore'
import AddDiary from '@/components/diary/AddDiary.vue'
import PetSelector from '@/components/profile/PetSelector.vue'
import type { CreateDiaryRequest } from '@/types/diary'

const router = useRouter()
const authStore = useAuthStore()
const diaryStore = useDiaryStore()
const petStore = usePetStore()
const isLoading = ref(true)
const error = ref('')

// 마운트 시 펫 정보 로드
onMounted(async () => {
  try {
    await petStore.fetchPets()
    if (!petStore.pets.length) {
      error.value = '등록된 반려견이 없습니다. 먼저 반려견을 등록해주세요.'
    }
  } catch (e) {
    console.error('펫 정보 로딩 실패:', e)
    error.value = '반려견 정보를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
})

// 선택된 펫 ID (기본값은 현재 선택된 펫)
const selectedPetIndex = ref(petStore.currentPetIndex)

// 선택된 펫 ID 계산
const selectedPetId = computed(() => {
  if (
    petStore.pets.length > 0 &&
    selectedPetIndex.value >= 0 &&
    selectedPetIndex.value < petStore.pets.length
  ) {
    return petStore.pets[selectedPetIndex.value].id
  }
  return undefined
})

// 펫 선택 변경 처리
const handlePetSwitch = (index: number) => {
  selectedPetIndex.value = index
}

// 일기 저장
const saveDiary = async (payload: CreateDiaryRequest, file?: File) => {
  try {
    const result = await diaryStore.addDiary(payload, file)
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

      <!-- 로딩 표시 -->
      <div v-if="isLoading" class="text-center py-12">
        <div
          class="inline-block animate-spin h-8 w-8 border-4 border-dang-primary border-t-transparent rounded-full mb-4"
        ></div>
        <p class="text-dang-secondary">반려견 정보를 불러오는 중...</p>
      </div>

      <!-- 에러 표시 -->
      <div
        v-else-if="error"
        class="text-center py-8 bg-dang-background rounded-xl shadow-md"
      >
        <p class="text-xl text-dang-primary mb-4">{{ error }}</p>
        <button
          @click="router.push('/profile')"
          class="px-6 py-2 bg-dang-primary text-white rounded-lg hover:bg-dang-secondary transition-colors"
        >
          반려견 등록하기
        </button>
      </div>

      <!-- 펫 선택 및 일기 폼 -->
      <div v-else-if="petStore.pets.length > 0">
        <!-- 펫 선택기 -->
        <div class="mb-6 bg-dang-background p-4 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium text-dang-primary mb-3">
            반려견 선택
          </h2>
          <PetSelector
            :pets="petStore.pets"
            :current-pet-index="selectedPetIndex"
            @switch="handlePetSwitch"
          />
        </div>

        <!-- 일기 폼 -->
        <AddDiary
          v-if="selectedPetId"
          :pet-id="selectedPetId"
          @submit="saveDiary"
          @cancel="handleCancel"
        />
        <div v-else class="text-center py-6 bg-dang-background rounded-lg">
          <p class="text-dang-secondary">반려견을 선택해주세요</p>
        </div>
      </div>
    </div>
  </div>
</template>
