<script setup lang="ts">
import { computed } from 'vue'
import type { Diary } from '@/types/diary'
import { getMoodEmoji, getWeatherEmoji, formatDate } from '@/utils/formatters'

const props = defineProps<{
  diary: Diary
}>()

const emotionDisplay = computed(() => getMoodEmoji(props.diary.emotionType))
const weatherDisplay = computed(() => getWeatherEmoji(props.diary.weatherType))
const formattedDate = computed(() => formatDate(props.diary.createdDate))
</script>

<template>
  <div class="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-bold text-dang-primary truncate">
        {{ diary.title }}
      </h3>
      <span class="text-sm text-dang-secondary">{{ formattedDate }}</span>
    </div>

    <div class="flex items-center gap-2 mb-2">
      <span class="text-sm">{{ emotionDisplay }}</span>
      <span class="text-sm">|</span>
      <span class="text-sm">{{ weatherDisplay }}</span>
    </div>

    <div v-if="diary.generatedImageUri" class="rounded overflow-hidden mt-2">
      <img
        :src="diary.generatedImageUri"
        alt="Generated"
        class="w-full h-40 object-cover rounded"
      />
    </div>

    <p class="mt-3 text-dang-secondary text-sm line-clamp-3">
      {{ diary.content }}
    </p>
  </div>
</template>
