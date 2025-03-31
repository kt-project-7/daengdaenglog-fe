<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera, Save, X, Pencil } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'

const props = defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  (e: 'update:profile', profile: Profile): void
}>()

const profileStore = useProfileStore()

const isEditing = ref(false)
const editedProfile = ref({ ...props.profile })
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const genderOptions = [
  { value: 'male', label: '남아' },
  { value: 'female', label: '여아' },
]

const genderDisplay = computed(() => {
  return props.profile.gender === 'male' ? '남아' : '여아'
})

const profileImage = computed(() => {
  return props.profile.imageUrl || defaultProfileImage
})

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    selectedImage.value = null
    imagePreview.value = null
  }
}

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedImage.value = input.files[0]
    imagePreview.value = URL.createObjectURL(input.files[0])
  }
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      const updatedProfile = {
        ...props.profile,
        imageUrl,
      }
      emit('update:profile', updatedProfile)
    }

    reader.readAsDataURL(file)
  }
}

const saveChanges = () => {
  const updatedProfile: Profile = {
    ...props.profile,
    ...editedProfile.value,
    imageUrl: imagePreview.value || props.profile.imageUrl,
  }
  emit('update:profile', updatedProfile)
  toggleEditMode()
}
</script>

<template>
  <div class="flex flex-col items-center relative">
    <!-- 프로필 헤더 -->
    <div class="flex flex-col items-center relative mb-12">
      <!-- 프로필 이미지 컨테이너 -->
      <div class="relative mb-10 flex flex-col items-center">
        <div class="relative">
          <img
            :src="profileImage"
            alt="프로필 이미지"
            class="w-32 h-32 rounded-full border-4 border-primary object-cover"
          />
          <label
            for="profile-image"
            class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/80 transition-colors z-10 shadow-lg"
          >
            <Camera class="w-5 h-5" />
          </label>
          <input
            ref="fileInput"
            type="file"
            id="profile-image"
            accept="image/*"
            class="hidden"
            @change="handleImageSelect"
          />
        </div>
      </div>

      <!-- 프로필 정보 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-_gray-400 mb-1"
              >이름</label
            >
            <input
              v-if="isEditing"
              v-model="editedProfile.name"
              type="text"
              class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-else class="text-_black">{{ profile.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-_gray-400 mb-1"
              >품종</label
            >
            <input
              v-if="isEditing"
              v-model="editedProfile.breed"
              type="text"
              class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-else class="text-_black">{{ profile.breed }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-_gray-400 mb-1"
              >나이</label
            >
            <input
              v-if="isEditing"
              v-model.number="editedProfile.age"
              type="number"
              class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-else class="text-_black">{{ profile.age }}세</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
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
                  v-model="editedProfile.gender"
                  :value="option.value"
                  class="text-primary focus:ring-primary"
                />
                <span class="text-_gray-400">{{ option.label }}</span>
              </label>
            </div>
            <p v-else class="text-_black">{{ genderDisplay }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-_gray-400 mb-1"
              >체중</label
            >
            <input
              v-if="isEditing"
              v-model.number="editedProfile.weight"
              type="number"
              step="0.1"
              class="w-full px-3 py-2 border border-_gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-else class="text-_black">{{ profile.weight }}kg</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-_gray-400 mb-1"
              >중성화 여부</label
            >
            <div v-if="isEditing" class="flex items-center gap-4">
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="editedProfile.neutered"
                  :value="true"
                  class="text-primary focus:ring-primary"
                />
                <span class="text-_gray-400">완료</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="editedProfile.neutered"
                  :value="false"
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

    <!-- 편집 버튼 -->
    <div class="flex justify-end gap-4 mt-4">
      <button
        v-if="isEditing"
        class="flex items-center gap-2 px-4 py-2 text-_gray-400 bg-_gray-100 rounded-lg hover:bg-_gray-200 transition-colors"
        @click="toggleEditMode"
      >
        <X class="w-4 h-4" />
        취소
      </button>
      <button
        v-if="isEditing"
        class="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        @click="saveChanges"
      >
        <Save class="w-4 h-4" />
        저장
      </button>
      <button
        v-else
        class="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        @click="toggleEditMode"
      >
        <Pencil class="w-4 h-4" />
        수정
      </button>
    </div>
  </div>
</template>
