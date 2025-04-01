<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile, Gender } from '@/types/profile'

const props = defineProps<{
  profile: Profile | null // profile이 null일 수도 있다는 것을 명시
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
  return props.profile?.gender === 'male' ? '여아' : '남아'
})
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
      <!-- 왼쪽 열 -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1">이름</label>
          <!-- profile이 null이 아니면 name을 표시, null이면 '정보 없음' 표시 -->
          <p class="text-_black">{{ profile?.name || '정보 없음' }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1">품종</label>
          <p class="text-_black">{{ profile?.breed || '정보 없음' }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1">나이</label>
          <p class="text-_black">{{ profile?.age }}세</p>
        </div>
      </div>

      <!-- 오른쪽 열 -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1">성별</label>
          <p class="text-_black">{{ genderDisplay }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1">체중</label>
          <p class="text-_black">{{ profile?.weight }}kg</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1">중성화 여부</label>
          <p class="text-_black">{{ profile?.neutered ? '완료' : '미완료' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
