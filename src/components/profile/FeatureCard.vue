<script setup lang="ts">
import { LucideIcon } from 'lucide-vue-next'

defineProps<{
  icon: LucideIcon
  title: string
  color: string
}>()
</script>

<template>
  <div
    class="bg-background rounded-xl p-6 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md"
    :class="`border-t-4 border-t-${color}`"
  >
    <div
      class="flex items-center gap-3 mb-4 pb-3 border-b-2 border-dang-primary"
    >
      <component :is="icon" class="w-7 h-7 text-dang-primary" />
      <h2 class="text-2xl text-gray-700 font-bold">
        {{ title }}
      </h2>
    </div>
    <slot></slot>
  </div>
</template>
