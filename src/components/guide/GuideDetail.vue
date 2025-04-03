<script setup lang="ts">
import { Pencil, ChevronRight } from 'lucide-vue-next'
import { GuideDetail } from '@/types/guide'

const props = defineProps<{
  selectedGuide: GuideDetail | null
}>()

const emit = defineEmits<{
  (e: 'back-to-list'): void
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const backToList = () => {
  emit('back-to-list')
}
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <button
        @click="backToList"
        class="mr-4 p-2 rounded-full hover:bg-_gray-100 transition-colors"
      >
        <ChevronRight class="w-5 h-5 text-_gray-700 transform rotate-180" />
      </button>
      <h2 class="text-2xl font-bold text-_gray-800">가이드 상세보기</h2>
    </div>

    <div v-if="selectedGuide" class="space-y-8 mb-4">
      <!-- Guide header -->
      <div class="text-center mb-6">
        <div
          class="inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4"
        >
          <Pencil class="w-12 h-12 text-chart-category3" />
        </div>
        <h3 class="text-2xl font-bold text-chart-category3">
          {{ selectedGuide.petName }}의 가이드
        </h3>
        <p class="text-lg text-_gray-500 mt-2">
          {{ formatDate(selectedGuide.createdDate) }} 생성
        </p>
      </div>

      <!-- Guide content -->
      <div
        class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20"
      >
        <h4 class="text-xl font-bold text-chart-category3 mb-4">가이드 내용</h4>
        <p class="text-_gray-700 leading-relaxed text-lg whitespace-pre-line">
          {{ selectedGuide.content }}
        </p>
      </div>
    </div>
  </div>
</template>
