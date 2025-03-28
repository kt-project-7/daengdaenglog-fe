<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import DBTICard from '@/components/profile/DBTICard.vue'
import PetsitterGuideCard from '@/components/profile/PetsitterGuideCard.vue'

const profileStore = useProfileStore()

// DBTI 분석
const analyzeDogPersonality = () => {
  profileStore.analyzeDogPersonality()
}

// 펫시터 가이드 생성
const generatePetsitterGuide = () => {
  const result = profileStore.generatePetsitterGuide()
  if (result.success) {
    alert(result.message)
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">댕댕이 프로필</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 프로필 정보 -->
      <ProfileInfo :profile="profileStore.profile" />

      <!-- 기능 카드 -->
      <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- DBTI 분석 카드 -->
        <DBTICard
          :profile="profileStore.profile"
          @analyze="analyzeDogPersonality"
        />

        <!-- 펫시터 가이드 카드 -->
        <PetsitterGuideCard
          :profile="profileStore.profile"
          @generate="generatePetsitterGuide"
        />
      </div>
    </div>
  </div>
</template>
