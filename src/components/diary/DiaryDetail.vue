<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { createDiaryMemoryImage } from '@/apis/diary'
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Mood, Weather } from '@/types/diary'
import MemorySection from './MemorySection.vue'

const route = useRoute()
const diaryId = computed(() => Number(route.params.id))
const diaryStore = useDiaryStore()

const isGenerating = ref(false)

// 다이어리 데이터 불러오기
onMounted(async () => {
  if (diaryId.value && !isNaN(diaryId.value)) {
    await diaryStore.setCurrentDiaryId(diaryId.value.toString())
  }
})

const diary = computed(() => diaryStore.currentDiary)
const memoryImage = computed(() =>
  diaryId.value ? diaryStore.getMemoryImage(diaryId.value.toString()) : '',
)

// 추억 생성 함수
const generateMemoryImage = async () => {
  if (!diaryId.value || isNaN(diaryId.value)) {
    console.warn('유효하지 않은 diaryId:', diaryId.value)
    return
  }

  try {
    isGenerating.value = true
    const result = await createDiaryMemoryImage(diaryId.value)
    diaryStore.setMemoryImage(
      diaryId.value.toString(),
      typeof result === 'string' ? result : result.imageUrl,
    )
  } catch (e) {
    console.error('추억 이미지 생성 실패:', e)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div v-if="diary" class="bg-white rounded-lg shadow-md overflow-hidden">
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
          {{ getMoodEmoji(diary.mood as Mood) }}
        </span>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {{ getWeatherEmoji(diary.weather as Weather) }}
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
        :memory-image="memoryImage"
        :pet-name="''"
        :diary-id="diaryId"
        :is-loading="isGenerating"
        @generate="generateMemoryImage"
      />
    </div>
  </div>
</template>
