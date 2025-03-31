<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiaryStore } from '@/stores/diaryStore'
import DiaryForm from '@/components/diary/DiaryForm.vue'
import LoginModal from '@/components/modals/LoginModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const diaryStore = useDiaryStore()

// 로그인 모달 상태
const showLoginModal = ref(false)

// 로그인 처리
const handleLogin = (success: boolean) => {
  if (success) {
    authStore.login()
    showLoginModal.value = false
  }
}

onMounted(() => {
  // 로그인 상태 초기화
  authStore.initializeAuth()

  // 로그인되지 않은 경우 모달 표시
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
  }
})

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

    <DiaryForm
      v-if="authStore.isAuthenticated"
      @submit="saveDiary"
      @cancel="handleCancel"
    />

    <!-- 로그인 모달 -->
    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLogin"
    />
  </div>
</template>
