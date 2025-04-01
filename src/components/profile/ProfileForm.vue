<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile, Gender } from '@/types/profile'

const props = defineProps<{
  profile: Profile
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:profile', editedProfile: Partial<Profile>): void
}>()

const genderOptions = [
  { value: 'male', label: '남아' },
  { value: 'female', label: '여아' },
]

const genderDisplay = computed(() => {
  return props.profile.gender === 'male' ? '남아' : '여아'
})
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
      <!-- 왼쪽 열 -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >이름</label
          >
          <p class="text-_black">{{ profile.name }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >품종</label
          >
          <p class="text-_black">{{ profile.breed }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >나이</label
          >
          <p class="text-_black">{{ profile.age }}세</p>
        </div>
      </div>

      <!-- 오른쪽 열 -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >성별</label
          >
          <p class="text-_black">{{ genderDisplay }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >체중</label
          >
          <p class="text-_black">{{ profile.weight }}kg</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >중성화 여부</label
          >
          <p class="text-_black">
            {{ profile.neutered ? '완료' : '미완료' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>