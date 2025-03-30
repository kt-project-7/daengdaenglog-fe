<template>
  <div
    class="fixed top-0 left-0 w-[300px] h-screen bg-white z-50 shadow-lg transition-transform duration-300 p-8"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <button
      class="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
      @click="$emit('toggleMenu')"
    >
      <X class="w-6 h-6 text-primary" />
    </button>

    <nav class="mt-8 flex flex-col gap-4">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        custom
        v-slot="{ navigate }"
      >
        <button
          @click="handleNavigation(navigate)"
          class="bg-transparent text-left text-lg py-3 px-4 rounded-lg transition-colors hover:bg-'_gray-100' hover:text-primary"
        >
          {{ item.label }}
        </button>
      </router-link>
    </nav>
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

const menuItems = [
  { path: '/diary-write', label: '일기 작성' },
  { path: '/diary-list', label: '일기 보기' },
  { path: '/dang-bti', label: '댕BTI' },
  { path: '/pet-guide', label: '펫가이드' },
]

const handleNavigation = (navigate: Function) => {
  navigate()
  emit('toggleMenu')
}
</script>
