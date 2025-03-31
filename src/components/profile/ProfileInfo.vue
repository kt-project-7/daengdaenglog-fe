<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera, Save, X, Pencil } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'

const props = defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  'update:profile': [profile: Profile]
}>()

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
            :src="imagePreview || profile.imageUrl || defaultProfileImage"
            alt="프로필 이미지"
            class="w-32 h-32 rounded-full border-4 border-[#f59e0b] object-cover"
          />
          <button
            type="button"
            class="absolute bottom-0 right-0 bg-[#f59e0b] text-white p-2 rounded-full shadow-lg hover:bg-[#d97706] transition-colors z-10"
            @click="fileInput?.click()"
          >
            <Camera class="w-5 h-5" />
          </button>
          <input
            ref="fileInput"
            type="file"
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
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >이름</label
            >
            <input
              v-if="isEditing"
              v-model="editedProfile.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
            />
            <p v-else class="text-gray-900">{{ profile.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >품종</label
            >
            <input
              v-if="isEditing"
              v-model="editedProfile.breed"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
            />
            <p v-else class="text-gray-900">{{ profile.breed }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >나이</label
            >
            <input
              v-if="isEditing"
              v-model.number="editedProfile.age"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
            />
            <p v-else class="text-gray-900">{{ profile.age }}세</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
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
                  class="text-[#f59e0b] focus:ring-[#f59e0b]"
                />
                <span class="text-gray-700">{{ option.label }}</span>
              </label>
            </div>
            <p v-else class="text-gray-900">{{ genderDisplay }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >체중</label
            >
            <input
              v-if="isEditing"
              v-model.number="editedProfile.weight"
              type="number"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
            />
            <p v-else class="text-gray-900">{{ profile.weight }}kg</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >중성화 여부</label
            >
            <div v-if="isEditing" class="flex items-center gap-4">
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="editedProfile.neutered"
                  :value="true"
                  class="text-[#f59e0b] focus:ring-[#f59e0b]"
                />
                <span class="text-gray-700">완료</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="editedProfile.neutered"
                  :value="false"
                  class="text-[#f59e0b] focus:ring-[#f59e0b]"
                />
                <span class="text-gray-700">미완료</span>
              </label>
            </div>
            <p v-else class="text-gray-900">
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
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        @click="toggleEditMode"
      >
        <X class="w-4 h-4" />
        취소
      </button>
      <button
        v-if="isEditing"
        class="flex items-center gap-2 px-4 py-2 text-white bg-[#f59e0b] rounded-lg hover:bg-[#d97706] transition-colors"
        @click="saveChanges"
      >
        <Save class="w-4 h-4" />
        저장
      </button>
      <button
        v-else
        class="flex items-center gap-2 px-4 py-2 text-white bg-[#f59e0b] rounded-lg hover:bg-[#d97706] transition-colors"
        @click="toggleEditMode"
      >
        <Pencil class="w-4 h-4" />
        수정
      </button>
    </div>
  </div>
</template>
<style scoped>
.profile-info {
  position: relative;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.profile-image-container {
  position: relative;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f59e0b;
  position: relative;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-upload-label {
  position: absolute;
  bottom: -40px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.camera-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.camera-button:hover {
  background-color: #e68a00;
  transform: translateY(-2px);
}

.camera-icon {
  width: 18px;
  height: 18px;
  color: white;
}

.camera-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.image-upload-input {
  display: none;
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f59e0b;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.edit-icon {
  width: 18px;
  height: 18px;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.cancel-button,
.save-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #ef4444;
  color: white;
}

.save-button {
  background-color: #10b981;
  color: white;
}

.action-icon {
  width: 18px;
  height: 18px;
}

.profile-details {
  text-align: center;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #4b5563;
}

.profile-breed {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.profile-info-list {
  margin-top: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #6b7280;
}

.info-value {
  font-weight: 500;
  color: #4b5563;
}

.profile-edit-form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 1rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.radio-input,
.checkbox-input {
  cursor: pointer;
}
</style>
