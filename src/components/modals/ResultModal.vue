<script setup lang="ts">
import { X, Share2, Copy, FileDown } from 'lucide-vue-next'

defineProps<{
  show: boolean
  title: string
}>()

defineEmits<{
  close: []
  'save-pdf': []
  'share-kakao': []
  'copy-link': []
}>()
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-100"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 내용 -->
      <div class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </div>

      <!-- 푸터 -->
      <div class="p-4 border-t flex items-center justify-end gap-3">
        <button
          @click="$emit('save-pdf')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
        >
          <FileDown class="w-5 h-5" />
          PDF 저장
        </button>
        <button
          @click="$emit('share-kakao')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
        >
          <Share2 class="w-5 h-5" />
          카카오톡 공유
        </button>
        <button
          @click="$emit('copy-link')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          <Copy class="w-5 h-5" />
          링크 복사
        </button>
      </div>
    </div>
  </div>
</template>
