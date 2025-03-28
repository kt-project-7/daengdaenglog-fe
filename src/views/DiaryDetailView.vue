<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import { useProfileStore } from '@/stores/profile'
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
const generateMemory = (type: 'image' | 'letter') => {
  diaryStore.generateMemory(type)
}
</script>

<template>
  <div v-if="currentDiary">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title-1">{{ formatDate(currentDiary.date) }}</h1>
      <div class="flex space-x-2">
        <router-link
          to="/"
          class="px-3 py-1 bg-_gray-100 text-_black rounded-md hover:bg-_gray-200 button-text"
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
  <div v-else class="text-center py-10">
    <p class="text-xl text-_gray-300">일기를 찾을 수 없습니다.</p>
    <router-link
      to="/"
      class="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-80 transition-colors button-text"
    >
      일기 목록으로 돌아가기
    </router-link>
  </div>
</template>
