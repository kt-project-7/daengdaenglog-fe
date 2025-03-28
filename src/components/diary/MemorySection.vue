<script setup lang="ts">
import { computed } from 'vue'
import type { Memory } from '@/types/diary'

const props = defineProps<{
  memory: Memory | null
  petName: string
}>()

const emit = defineEmits<{
  (e: 'generate', type: 'image' | 'letter'): void
}>()

const hasMemory = computed(() => !!props.memory)

// 추억 생성
const generateMemory = (type: 'image' | 'letter') => {
  emit('generate', type)
}
</script>

<template>
  <!-- 추억 섹션 -->
  <div v-if="hasMemory && memory" class="mt-8 border-t border-_gray-100 pt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="title-2 flex items-center">
        <span class="mr-2">✨</span>
        <span>이날의 추억</span>
      </h2>
    </div>

    <div v-if="memory.type === 'image'" class="mb-4">
      <img
        :src="memory.content"
        alt="AI가 생성한 추억 이미지"
        class="w-full max-h-80 object-contain rounded-lg shadow-md"
      />
    </div>

    <div
      v-else-if="memory.type === 'letter'"
      class="bg-primary bg-opacity-10 p-4 rounded-lg border border-primary border-opacity-20"
    >
      <p class="whitespace-pre-line italic text-_black body-text">
        {{ memory.content }}
      </p>
      <p class="text-right mt-2 text-primary font-medium">
        - {{ petName }} 올림
      </p>
    </div>
  </div>

  <!-- 추억 생성 버튼 -->
  <div v-if="!hasMemory" class="mt-8 border-t border-_gray-100 pt-6">
    <h2 class="title-2 mb-4">이날의 추억 만들기</h2>
    <div class="flex flex-col sm:flex-row gap-4">
      <button
        @click="generateMemory('image')"
        class="flex-1 bg-gradient-to-r from-primary to-primary text-white py-3 px-4 rounded-lg shadow hover:opacity-80 flex items-center justify-center button-text"
      >
        그림으로 추억 만들기
      </button>

      <button
        @click="generateMemory('letter')"
        class="flex-1 bg-primary text-white py-3 px-4 rounded-lg shadow hover:opacity-80 flex items-center justify-center button-text"
      >
        편지로 추억 만들기
      </button>
    </div>
  </div>
</template>
