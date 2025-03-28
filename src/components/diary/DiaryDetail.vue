<script setup lang="ts">
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary } from '@/types/diary'
import MemorySection from './MemorySection.vue'

defineProps<{
  diary: Diary
  petName: string
}>()

defineEmits<{
  (e: 'generateMemory', type: 'image' | 'letter'): void
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div v-if="diary.imageUrl" class="w-full h-64 md:h-80">
      <img
        :src="diary.imageUrl"
        :alt="`${formatDate(diary.date)} 일기 이미지`"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-6">
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          class="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full"
        >
          {{ getMoodEmoji(diary.mood) }}
        </span>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {{ getWeatherEmoji(diary.weather) }}
        </span>
        <span
          v-if="diary.walkTime"
          class="px-3 py-1 bg-green-100 text-green-800 rounded-full"
        >
          산책: {{ diary.walkTime }}분
        </span>
        <span
          v-if="diary.mealTime"
          class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
        >
          식사: {{ diary.mealTime }}
        </span>
      </div>

      <div class="prose max-w-none">
        <p class="whitespace-pre-line body-text text-_black">
          {{ diary.content }}
        </p>
      </div>

      <MemorySection
        :memory="diary.memory"
        :pet-name="petName"
        @generate="$emit('generateMemory', $event)"
      />
    </div>
  </div>
</template>
