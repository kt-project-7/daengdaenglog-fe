<script setup lang="ts">
import { Dog, Cat, UserCircle } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

defineProps<{
  pets: Profile[]
  currentPetIndex: number
}>()

defineEmits<{
  (e: 'switch', index: number): void
  (e: 'add'): void
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex gap-4">
      <button
        v-for="(pet, index) in pets"
        :key="pet.id"
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
        :class="[
          currentPetIndex === index
            ? 'bg-primary text-white'
            : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200',
        ]"
        @click="$emit('switch', index)"
      >
        <Dog v-if="pet.petType === 'DOG'" class="w-5 h-5" />
        <Cat v-else class="w-5 h-5" />
        {{ pet.name }}
      </button>
    </div>
  </div>
</template>
