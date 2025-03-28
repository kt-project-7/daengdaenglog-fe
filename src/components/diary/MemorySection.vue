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
  <div v-if="hasMemory && memory" class="mt-8 border-t pt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold flex items-center">
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
      class="bg-amber-50 p-4 rounded-lg border border-amber-200"
    >
      <p class="whitespace-pre-line italic text-amber-900">
        {{ memory.content }}
      </p>
      <p class="text-right mt-2 text-amber-700 font-medium">
        - {{ petName }} 올림
      </p>
    </div>
  </div>

  <!-- 추억 생성 버튼 -->
  <div v-if="!hasMemory" class="mt-8 border-t pt-6">
    <h2 class="text-xl font-semibold mb-4">이날의 추억 만들기</h2>
    <div class="flex flex-col sm:flex-row gap-4">
      <button
        @click="generateMemory('image')"
        class="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white py-3 px-4 rounded-lg shadow hover:from-amber-500 hover:to-amber-600 flex items-center justify-center"
      >
        그림으로 추억 만들기
      </button>

      <button
        @click="generateMemory('letter')"
        class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg shadow hover:from-amber-600 hover:to-amber-700 flex items-center justify-center"
      >
        편지로 추억 만들기
      </button>
    </div>
  </div>
</template>
