<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()

defineEmits<{
  generate: []
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <FileText class="w-6 h-6 text-green-500" />
        <h3 class="text-xl font-bold text-gray-800">펫시터 가이드</h3>
      </div>
      <div class="space-y-4">
        <p class="text-gray-600">
          {{ profile.name }}의 펫시터를 위한 상세 가이드를 생성해드립니다. 식사,
          산책, 특이사항 등 반려동물을 돌보는 데 필요한 모든 정보가 포함됩니다.
        </p>
      </div>
    </div>

    <button
      class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      @click="$emit('generate')"
    >
      <FileText class="w-5 h-5" />
      펫시터 가이드 생성하기
    </button>
  </div>
</template>
