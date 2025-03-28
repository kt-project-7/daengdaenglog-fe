<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import DiaryForm from '@/components/diary/DiaryForm.vue'

const router = useRouter()
const diaryStore = useDiaryStore()

// 일기 저장
const saveDiary = () => {
  const diaryId = diaryStore.saveDiary()
  router.push('/')
}

// 취소 처리
const handleCancel = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <h1 class="title-1 mb-6">오늘의 댕댕이 관찰일기</h1>

    <DiaryForm @submit="saveDiary" @cancel="handleCancel" />
  </div>
</template>
