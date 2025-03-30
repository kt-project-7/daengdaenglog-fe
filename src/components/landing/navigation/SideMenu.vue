<template>
  <div
    class="fixed top-0 left-0 w-[300px] h-screen bg-white z-50 shadow-lg transition-transform duration-300 p-8"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <button
      class="absolute top-4 right-4 bg-transparent border-none cursor-pointer flex items-center justify-center"
      @click="$emit('toggleMenu')"
    >
      <X class="w-6 h-6 text-primary" />
    </button>
    <div class="mt-8 flex flex-col gap-4">
      <router-link to="/diary-write" custom v-slot="{ navigate }">
        <button
          @click="handleNavigation(navigate)"
          class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-'_gray-100' hover:text-primary"
        >
          일기 작성
        </button>
      </router-link>
      <router-link to="/diary-list" custom v-slot="{ navigate }">
        <button
          @click="handleNavigation(navigate)"
          class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-'_gray-100' hover:text-primary"
        >
          일기 보기
        </button>
      </router-link>
      <router-link to="/dang-bti" custom v-slot="{ navigate }">
        <button
          @click="handleNavigation(navigate)"
          class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-'_gray-100' hover:text-primary"
        >
          댕BTI
        </button>
      </router-link>
      <router-link to="/pet-guide" custom v-slot="{ navigate }">
        <button
          @click="handleNavigation(navigate)"
          class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-'_gray-100' hover:text-primary"
        >
          펫가이드
        </button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleMenu'): void
}>()

const handleNavigation = (navigate: Function) => {
  navigate()
  emit('toggleMenu')
}
</script>
