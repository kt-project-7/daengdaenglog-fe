<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  memoryImage?: string
  petName: string
  diaryId: number
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'generate', diaryId: number): void
}>()

// memoryImage prop을 감시하여 콘솔에 기록
watch(
  () => props.memoryImage,
  (newImage) => {
    console.log('MemorySection - memoryImage 변경됨:', newImage)
  },
)

const hasMemory = computed(() => !!props.memoryImage)
const generateMemory = () => emit('generate', props.diaryId)
</script>

<template>
  <div class="mt-8 border-t border-_gray-100 pt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="title-2 flex items-center">
        <span class="mr-2">✨</span>
        <span>이날의 추억</span>
      </h2>
    </div>

    <div class="space-y-6">
      <div v-if="hasMemory">
        <h3 class="body-text font-medium mb-2 text-primary">그림 추억</h3>
        <img
          :src="memoryImage"
          :key="memoryImage"
          alt="AI가 생성한 추억 이미지"
          class="w-full max-h-80 object-contain rounded-lg shadow-md"
        />
      </div>
    </div>

    <div v-if="!hasMemory" class="text-center py-4 text-_gray-300">
      <p>아직 추억이 없어요. 아래 버튼으로 추억을 만들어보세요!</p>
    </div>

    <div class="mt-6">
      <button
        v-if="!hasMemory"
        @click="generateMemory"
        :disabled="isLoading"
        class="w-full bg-gradient-to-r from-primary to-primary text-white py-3 px-4 rounded-lg shadow hover:opacity-80 flex items-center justify-center button-text"
      >
        <span v-if="!isLoading">AI로 추억 만들기</span>
        <span v-else>추억 만드는 중...</span>
      </button>
    </div>
  </div>
</template>
