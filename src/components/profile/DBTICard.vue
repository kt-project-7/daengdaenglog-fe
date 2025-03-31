<script setup lang="ts">
import { Brain } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()

defineEmits<{
  analyze: []
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="profile.dbtiResult"
      class="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div class="flex items-center gap-3 mb-4">
        <Brain class="w-6 h-6 text-blue-500" />
        <h3 class="text-xl font-bold text-gray-800">DBTI 분석 결과</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold text-blue-500 mb-2">
            {{ profile.dbtiResult.type }}
          </h4>
          <p class="text-gray-600 leading-relaxed">
            {{ profile.dbtiResult.description }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600 mb-4">아직 DBTI 분석이 진행되지 않았습니다.</p>
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        @click="$emit('analyze')"
      >
        <Brain class="w-5 h-5" />
        DBTI 분석하기
      </button>
    </div>
  </div>
</template>
