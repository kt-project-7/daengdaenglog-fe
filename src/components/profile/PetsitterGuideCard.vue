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
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
      >
        <span class="text-blue-600 text-xl">📋</span>
      </div>
      <h3 class="text-xl font-semibold">펫시터 가이드</h3>
    </div>

    <p class="text-gray-600 mb-4">
      최근 5일간의 일기를 기반으로 펫시터를 위한 맞춤 가이드를 생성합니다.
    </p>

    <button
      @click="$emit('generate')"
      class="mt-auto py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
    >
      <span>펫시터 가이드 생성하기</span>
    </button>
  </div>
</template>
