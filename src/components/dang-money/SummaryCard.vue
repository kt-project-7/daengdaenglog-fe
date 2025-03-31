<template>
  <div
    class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-dang-md transition-transform duration-300 hover:-translate-y-1 flex-1"
  >
    <component :is="iconComponent" class="w-10 h-10 text-dang-primary" />
    <div class="flex flex-col">
      <h3 class="text-base text-_gray-400 mb-2">{{ title }}</h3>
      <p class="text-xl font-bold text-dang-primary">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DollarSign, FileText, TrendingUp } from 'lucide-vue-next'

const props = defineProps<{
  icon: string
  title: string
  value: string
}>()

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'DollarSign':
      return DollarSign
    case 'FileText':
      return FileText
    case 'TrendingUp':
      return TrendingUp
    default:
      return DollarSign
  }
})
</script>
