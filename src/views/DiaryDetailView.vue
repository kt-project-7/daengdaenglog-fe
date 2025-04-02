<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diaryStore'
import { usePetStore } from '@/stores/petStore'
import { formatDate } from '@/utils/formatters'
import DiaryDetail from '@/components/diary/DiaryDetail.vue'

const route = useRoute()
const router = useRouter()
const diaryStore = useDiaryStore()
const petStore = usePetStore()
const diaryDetailRef = ref<InstanceType<typeof DiaryDetail> | null>(null)

// 라우터 파라미터에서 일기 ID 가져오기
const diaryId = computed(() => Number(route.params.id))

onMounted(async () => {
  if (diaryId.value && !isNaN(diaryId.value)) {
    await diaryStore.loadDiaryDetail(diaryId.value)
  }
})

// 현재 일기
const currentDiary = computed(() => diaryStore.selectedDiary)

// 반려견 이름
const petName = computed(() => petStore.currentPet?.name || '')

// 일기가 업데이트되었을 때
const handleDiaryUpdated = async () => {
  if (diaryId.value && !isNaN(diaryId.value)) {
    await diaryStore.loadDiaryDetail(diaryId.value)
  }
}

// 일기가 삭제되었을 때
const handleDiaryDeleted = () => {
  router.push('/diary-list')
}

// 추억 생성 함수 (DiaryDetail에서 defineExpose로 노출된 메서드)
const generateMemory = () => {
  const instance = diaryDetailRef.value as unknown as {
    generateMemory: () => void
  }
  instance?.generateMemory()
}
</script>

<template>
  <div
    class="min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]"
  >
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div
        v-if="currentDiary"
        class="bg-dang-background rounded-xl shadow-dang-md p-6 border border-dang-light"
      >
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-dang-primary">
            {{ formatDate(currentDiary.createdDate) }}
          </h1>
          <div class="flex space-x-2">
            <router-link
              to="/diary-list"
              class="px-3 py-1 bg-dang-light text-dang-secondary rounded-md hover:bg-dang-pending transition-colors shadow-sm"
            >
              목록으로
            </router-link>
          </div>
        </div>

        <DiaryDetail
          ref="diaryDetailRef"
          :diary="currentDiary"
          :pet-name="petName"
          @diary-updated="handleDiaryUpdated"
          @diary-deleted="handleDiaryDeleted"
        />
        <div
          class="absolute bottom-5 left-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 -rotate-15 animate-bounce-custom"
        ></div>
        <div
          class="absolute bottom-5 right-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 rotate-15 animate-bounce-delay-2"
        ></div>
        <div
          class="absolute top-10 right-10 w-[2.5rem] h-[2.5rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 rotate-45 animate-bounce-delay-3"
        ></div>
        <div
          class="absolute top-20 left-20 w-[2rem] h-[2rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 -rotate-30 animate-bounce-delay-4"
        ></div>
      </div>
      <div
        v-else
        class="text-center py-10 bg-dang-background rounded-xl shadow-dang-md"
      >
        <p class="text-xl text-dang-secondary">일기를 찾을 수 없습니다.</p>
        <router-link
          to="/diary-list"
          class="mt-4 inline-block bg-dang-primary text-white px-6 py-2 rounded-lg hover:bg-dang-secondary transition-colors shadow-dang-sm"
        >
          일기 목록으로 돌아가기
        </router-link>
      </div>
    </div>
  </div>
</template>
