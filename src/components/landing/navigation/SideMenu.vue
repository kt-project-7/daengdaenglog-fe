<template>
  <div
    class="fixed top-0 left-0 w-[18.75rem] h-screen bg-white z-50 shadow-lg transition-transform duration-300 p-8"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <button
      class="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
      @click="$emit('toggleMenu')"
    >
      <X class="w-6 h-6 text-primary" />
    </button>

    <nav class="mt-8 flex flex-col gap-4">
      <button
        v-for="item in menuItems"
        :key="item.path"
        @click="handleNavigation(item.path)"
        class="bg-transparent text-left text-lg py-3 px-4 rounded-lg transition-colors hover:bg-'_gray-100' hover:text-primary"
      >
        {{ item.label }}
      </button>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleMenu'): void
}>()

const menuItems = [
  { path: '/diary-write', label: '🐾일기 작성' },
  { path: '/diary-list', label: '🐾일기 목록' },
  { path: '/profile', label: '🐾마이페이지' },
  { path: '/dang-money-chart', label: '🐾댕머니 차트' },
  { path: '/dang-guide', label: '🐾댕가이드' },
]

const handleNavigation = (path: string) => {
  router.push(path)
  emit('toggleMenu')
}
</script>
