<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiaryStore } from '@/stores/diaryStore'
import DiaryForm from '@/components/diary/DiaryForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const diaryStore = useDiaryStore()

// 일기 저장
const saveDiary = () => {
  const diaryId = diaryStore.saveDiary()
  router.push(`/diary/${diaryId}`)
}

// 취소 처리
const handleCancel = () => {
  router.push('/diary-list')
}
</script>

<template>
  <div>
    <h1 class="title-1 mb-6">오늘의 댕댕이 관찰일기</h1>

    <DiaryForm
      v-if="authStore.isAuthenticated"
      @submit="saveDiary"
      @cancel="handleCancel"
    />
  </div>
</template>
