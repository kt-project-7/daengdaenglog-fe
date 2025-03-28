<script setup lang="ts">
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()

defineEmits<{
  (e: 'generate'): void
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 flex flex-col">
    <div class="flex items-center mb-4">
      <div
        class="w-10 h-10 rounded-full bg-_gray-100 flex items-center justify-center mr-3"
      >
        <span class="text-_gray-400 text-xl">📋</span>
      </div>
      <h3 class="title-2">펫시터 가이드</h3>
    </div>

    <p class="body-text text-_gray-400 mb-4">
      최근 5일간의 일기를 기반으로 펫시터를 위한 맞춤 가이드를 생성합니다.
    </p>

    <button
      @click="$emit('generate')"
      class="mt-auto py-2 bg-_black text-white rounded-md hover:opacity-80 flex items-center justify-center button-text"
    >
      <span>펫시터 가이드 생성하기</span>
    </button>
  </div>
</template>
