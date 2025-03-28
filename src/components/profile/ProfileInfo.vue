<script setup lang="ts">
import type { Profile } from '@/types/profile'

defineProps<{
  profile: Profile
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 md:col-span-1">
    <div class="flex flex-col items-center">
      <div
        class="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-amber-300"
      >
        <img
          :src="profile.imageUrl || 'https://via.placeholder.com/128'"
          alt="강아지 프로필 사진"
          class="w-full h-full object-cover"
        />
      </div>

      <h2 class="text-2xl font-bold mb-1">{{ profile.name }}</h2>
      <p class="text-gray-600 mb-4">{{ profile.breed }}</p>

      <div class="w-full mt-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">나이</span>
          <span class="font-medium">{{ profile.age }}살</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">성별</span>
          <span class="font-medium">{{
            profile.gender === 'male' ? '남아' : '여아'
          }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">몸무게</span>
          <span class="font-medium">{{ profile.weight }}kg</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">중성화</span>
          <span class="font-medium">{{
            profile.neutered ? '완료' : '미완료'
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
