<script setup lang="ts">
import { computed } from 'vue'
import type { Memory, MemoryType } from '@/types/diary'

const props = defineProps<{
  memory: Memory | null
  petName: string
  diaryId: string
}>()

const emit = defineEmits<{
  (e: 'generate', type: MemoryType): void
}>()

const hasMemory = computed(() => !!props.memory)
const hasImageMemory = computed(() => !!props.memory?.image)
const hasLetterMemory = computed(() => !!props.memory?.letter)

// 추억 생성
const generateMemory = (type: MemoryType) => {
  emit('generate', type)
}
</script>

<template>
  <!-- 추억 섹션 -->
  <div class="mt-8 border-t border-_gray-100 pt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="title-2 flex items-center">
        <span class="mr-2">✨</span>
        <span>이날의 추억</span>
      </h2>
    </div>

    <!-- 추억 콘텐츠 영역 -->
    <div class="space-y-6">
      <!-- 이미지 추억이 있는 경우 -->
      <div v-if="hasImageMemory">
        <h3 class="body-text font-medium mb-2 text-primary">그림 추억</h3>
        <img
          :src="memory?.image?.content"
          alt="AI가 생성한 추억 이미지"
          class="w-full max-h-80 object-contain rounded-lg shadow-md"
        />
      </div>

      <!-- 편지 추억이 있는 경우 -->
      <div v-if="hasLetterMemory">
        <h3 class="body-text font-medium mb-2 text-primary">편지 추억</h3>
        <div
          class="bg-primary bg-opacity-10 p-4 rounded-lg border border-primary border-opacity-20"
        >
          <p class="whitespace-pre-line italic text-_black body-text">
            {{ memory?.letter?.content }}
          </p>
          <p class="text-right mt-2 text-primary font-medium">
            - {{ petName }} 올림
          </p>
        </div>
      </div>
    </div>

    <!-- 추억 없는 경우 안내 메시지 -->
    <div
      v-if="!hasImageMemory && !hasLetterMemory"
      class="text-center py-4 text-_gray-300"
    >
      <p>아직 추억이 없어요. 아래 버튼으로 추억을 만들어보세요!</p>
    </div>

    <!-- 추억 생성 버튼 섹션 -->
    <div class="mt-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- 이미지 추억이 없으면 이미지 생성 버튼 표시 -->
        <button
          v-if="!hasImageMemory"
          @click="generateMemory('image')"
          class="flex-1 bg-gradient-to-r from-primary to-primary text-white py-3 px-4 rounded-lg shadow hover:opacity-80 flex items-center justify-center button-text"
        >
          {{ hasMemory ? '그림 추억도 만들기' : '그림으로 추억 만들기' }}
        </button>

        <!-- 편지 추억이 없으면 편지 생성 버튼 표시 -->
        <button
          v-if="!hasLetterMemory"
          @click="generateMemory('letter')"
          class="flex-1 bg-primary text-white py-3 px-4 rounded-lg shadow hover:opacity-80 flex items-center justify-center button-text"
        >
          {{ hasMemory ? '편지 추억도 만들기' : '편지로 추억 만들기' }}
        </button>
      </div>
    </div>
  </div>
</template>
