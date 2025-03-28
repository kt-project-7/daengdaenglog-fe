<script setup lang="ts">
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()

defineEmits<{
  (e: 'analyze'): void
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 flex flex-col">
    <div class="flex items-center mb-4">
      <div
        class="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3"
      >
        <span class="text-primary text-xl">🧠</span>
      </div>
      <h3 class="title-2">강아지 유형 분석</h3>
    </div>

    <p class="body-text text-_gray-400 mb-4">
      {{ profile.name }}의 성격과 행동 패턴을 분석하여 DBTI 유형을 알아보세요.
    </p>

    <div
      v-if="profile.dbtiResult"
      class="bg-primary bg-opacity-10 p-4 rounded-lg mb-4"
    >
      <div class="text-center mb-2">
        <span class="title-2 text-primary">{{ profile.dbtiResult.type }}</span>
      </div>
      <p class="body-text text-_black">{{ profile.dbtiResult.description }}</p>
    </div>

    <button
      @click="$emit('analyze')"
      class="mt-auto py-2 bg-primary text-white rounded-md hover:opacity-80 flex items-center justify-center button-text"
    >
      <span>{{
        profile.dbtiResult ? 'DBTI 다시 분석하기' : 'DBTI 분석하기'
      }}</span>
    </button>
  </div>
</template>
