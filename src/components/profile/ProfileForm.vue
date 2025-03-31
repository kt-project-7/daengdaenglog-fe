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

const editedProfile = ref({ ...props.profile })

const genderOptions = [
  { value: 'male', label: '남아' },
  { value: 'female', label: '여아' },
]

const genderDisplay = computed(() => {
  return props.profile.gender === 'male' ? '남아' : '여아'
})

const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
  editedProfile.value[field] = value
  emit('update:profile', editedProfile.value)
}
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
          <input
            v-if="isEditing"
            :value="editedProfile.name"
            @input="
              updateField('name', ($event.target as HTMLInputElement).value)
            "
            type="text"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-else class="text-_black">{{ profile.name }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >품종</label
          >
          <input
            v-if="isEditing"
            :value="editedProfile.breed"
            @input="
              updateField('breed', ($event.target as HTMLInputElement).value)
            "
            type="text"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-else class="text-_black">{{ profile.breed }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >나이</label
          >
          <input
            v-if="isEditing"
            :value="editedProfile.age"
            @input="
              updateField(
                'age',
                Number(($event.target as HTMLInputElement).value),
              )
            "
            type="number"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-else class="text-_black">{{ profile.age }}세</p>
        </div>
      </div>

      <!-- 오른쪽 열 -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >성별</label
          >
          <div v-if="isEditing" class="flex items-center gap-4">
            <label
              v-for="option in genderOptions"
              :key="option.value"
              class="flex items-center gap-2"
            >
              <input
                type="radio"
                :checked="editedProfile.gender === option.value"
                @change="updateField('gender', option.value as Gender)"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">{{ option.label }}</span>
            </label>
          </div>
          <p v-else class="text-_black">{{ genderDisplay }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >체중</label
          >
          <input
            v-if="isEditing"
            :value="editedProfile.weight"
            @input="
              updateField(
                'weight',
                Number(($event.target as HTMLInputElement).value),
              )
            "
            type="number"
            step="0.1"
            class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-else class="text-_black">{{ profile.weight }}kg</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-_gray-400 mb-1"
            >중성화 여부</label
          >
          <div v-if="isEditing" class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                :checked="editedProfile.neutered === true"
                @change="updateField('neutered', true)"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">완료</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                :checked="editedProfile.neutered === false"
                @change="updateField('neutered', false)"
                class="text-primary focus:ring-primary"
              />
              <span class="text-_gray-400">미완료</span>
            </label>
          </div>
          <p v-else class="text-_black">
            {{ profile.neutered ? '완료' : '미완료' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
