<script setup lang="ts">
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary } from '@/types/diary'

defineProps<{
  diary: Diary
}>()

defineEmits<{
  (e: 'click', id: string): void
}>()
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    @click="$emit('click', diary.id)"
  >
    <div v-if="diary.imageUrl" class="h-48 overflow-hidden">
      <img
        :src="diary.imageUrl"
        :alt="`${formatDate(diary.date)} 일기 이미지`"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-semibold">{{ formatDate(diary.date) }}</span>
        <div class="flex space-x-2">
          <span class="text-sm px-2 py-1 bg-amber-100 rounded-full">{{
            getMoodEmoji(diary.mood)
          }}</span>
          <span class="text-sm px-2 py-1 bg-blue-100 rounded-full">{{
            getWeatherEmoji(diary.weather)
          }}</span>
        </div>
      </div>

      <p class="text-gray-700 line-clamp-3">{{ diary.content }}</p>

      <div class="mt-3 flex justify-between text-sm text-gray-500">
        <span v-if="diary.walkTime">산책: {{ diary.walkTime }}분</span>
        <span v-if="diary.mealTime">식사: {{ diary.mealTime }}</span>
      </div>

      <div v-if="diary.hasMemory" class="mt-2 text-amber-600 text-sm">
        <span class="flex items-center">
          <span class="mr-1">✨</span>
          추억이 생성되었어요
        </span>
      </div>
    </div>
  </div>
</template>
