<script setup lang="ts">
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary } from '@/types/diary'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  diary: Diary
}>()

const handleClick = (id: string) => {
  router.push(`/diary/${id}`)
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    @click="handleClick(diary.id)"
  >
    <div v-if="diary.imageUrl" class="h-48 overflow-hidden">
      <img
        :src="diary.imageUrl"
        :alt="`${formatDate(diary.date)} 일기 이미지`"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-4">
      <h3 class="title-2 mb-3">{{ formatDate(diary.date) }}</h3>

      <div class="flex flex-wrap gap-2 mb-3">
        <span class="text-sm px-2 py-1 bg-primary bg-opacity-10 rounded-full">{{
          getMoodEmoji(diary.mood)
        }}</span>
        <span class="text-sm px-2 py-1 bg-blue-100 rounded-full">{{
          getWeatherEmoji(diary.weather)
        }}</span>
      </div>

      <p class="body-text text-_black line-clamp-3">{{ diary.content }}</p>

      <div class="mt-3 flex justify-between text-sm text-_gray-300">
        <span v-if="diary.walkTime">산책: {{ diary.walkTime }}분</span>
        <span v-if="diary.mealTime">식사: {{ diary.mealTime }}</span>
      </div>

      <div v-if="diary.hasMemory" class="mt-2 text-primary text-sm">
        <span class="flex items-center">
          <span class="mr-1">✨</span>
          추억이 생성되었어요
        </span>
      </div>
    </div>
  </div>
</template>
