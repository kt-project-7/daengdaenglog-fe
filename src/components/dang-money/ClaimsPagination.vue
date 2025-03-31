<template>
  <div class="flex justify-center items-center gap-4 mt-8">
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="bg-transparent border-none cursor-pointer text-_gray-400 transition-colors duration-200 disabled:text-_gray-200 disabled:cursor-not-allowed hover:text-dang-primary"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>
    <span class="text-sm text-_gray-400"
      >{{ currentPage }} / {{ totalPages }}</span
    >
    <button
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
      class="bg-transparent border-none cursor-pointer text-_gray-400 transition-colors duration-200 disabled:text-_gray-200 disabled:cursor-not-allowed hover:text-dang-primary"
    >
      <ChevronRight class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>
