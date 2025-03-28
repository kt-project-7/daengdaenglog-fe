<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import DiaryCard from '@/components/diary/DiaryCard.vue'

const router = useRouter()
const diaryStore = useDiaryStore()

onMounted(() => {
  // 현재 다이어리 ID 초기화
  diaryStore.setCurrentDiaryId('')
})

// 일기 상세보기로 이동
const viewDiary = (id: string) => {
  router.push(`/diary/${id}`)
}
</script>

<template>
  <div>
    <h1 class="title-1 mb-6">나의 댕댕이 관찰일기</h1>

    <div v-if="diaryStore.diaries.length === 0" class="text-center py-10">
      <p class="text-xl text-gray-500">아직 작성된 일기가 없어요!</p>
      <router-link
        to="/write"
        class="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-80 transition-colors button-text"
      >
        첫 일기 작성하기
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DiaryCard
        v-for="diary in diaryStore.diaries"
        :key="diary.id"
        :diary="diary"
        @click="viewDiary(diary.id)"
      />
    </div>
  </div>
</template>
