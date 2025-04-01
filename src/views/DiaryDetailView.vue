<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDiaryStore } from '@/stores/diaryStore'
import { useProfileStore } from '@/stores/profileStore'
import { formatDate } from '@/utils/formatters'
import DiaryDetail from '@/components/diary/DiaryDetail.vue'

const route = useRoute()
const diaryStore = useDiaryStore()
const profileStore = useProfileStore()

// 라우터 파라미터에서 일기 ID 가져오기
const diaryId = computed(() => route.params.id as string)

onMounted(() => {
  if (diaryId.value) {
    diaryStore.setCurrentDiaryId(diaryId.value)
  }
})

// 현재 일기
const currentDiary = computed(() => diaryStore.currentDiary)

// 반려견 이름
const petName = computed(() => profileStore.profile.name)

// 추억 생성
// const generateMemory = () => {
//   if (currentDiary.value) {
//     diaryStore.generateMemory(currentDiary.value.id)
//   }
// }
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
            {{ formatDate(currentDiary.date) }}
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
          :diary="currentDiary"
          :pet-name="petName"
          @generate-memory="generateMemory"
        />
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
