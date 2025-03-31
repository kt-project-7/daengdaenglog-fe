<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()

defineEmits<{
  generate: []
  'show-guide': []
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="profile.petsitterGuide"
      class="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div class="flex items-center gap-3 mb-4">
        <Pencil class="w-6 h-6 text-green-500" />
        <h3 class="text-xl font-bold text-gray-800">펫시터 가이드</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold text-green-500 mb-2">
            {{ profile.name }}의 펫시터 가이드
          </h4>
          <p class="text-gray-600 leading-relaxed line-clamp-2">
            {{ profile.petsitterGuide.generalInfo }}
          </p>
        </div>
      </div>

      <!-- 가이드 상세보기 버튼 -->
      <button
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        @click="$emit('show-guide')"
      >
        <Pencil class="w-5 h-5" />
        가이드 상세보기
      </button>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600 mb-4">
        아직 펫시터 가이드가 생성되지 않았습니다.
      </p>
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        @click="$emit('generate')"
      >
        <Pencil class="w-5 h-5" />
        펫시터 가이드 생성하기
      </button>
    </div>
  </div>
</template>
