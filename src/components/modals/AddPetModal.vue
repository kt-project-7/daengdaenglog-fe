<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add', pet: Profile): void
}>()

const newPet = ref<Profile>({
  id: 0,
  name: '',
  petType: '',
  age: 0,
  gender: 'male',
  weight: 0,
  neutered: false,
  imageUrl: defaultProfileImage,
  pbti: null,
  petsitterGuide: null,
})

const handleSubmit = () => {
  emit('add', { ...newPet.value })
  emit('close')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
      <!-- 닫기 버튼 -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-_gray-400 hover:text-_gray-600"
      >
        <X class="w-6 h-6" />
      </button>

      <h2 class="text-2xl font-bold mb-6">새로운 반려동물 추가</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >이름</label
          >
          <input
            v-model="newPet.name"
            type="text"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >품종</label
          >
          <input
            v-model="newPet.petType"
            type="text"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >나이</label
          >
          <input
            v-model.number="newPet.age"
            type="number"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >성별</label
          >
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="newPet.gender"
                value="male"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">수컷</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="newPet.gender"
                value="female"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">암컷</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >체중 (kg)</label
          >
          <input
            v-model.number="newPet.weight"
            type="number"
            step="0.1"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >중성화 여부</label
          >
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="newPet.neutered"
                :value="true"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">완료</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="newPet.neutered"
                :value="false"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">미완료</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-_gray-400 bg-_gray-100 rounded-lg hover:bg-_gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            추가하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
