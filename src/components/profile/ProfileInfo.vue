<script setup lang="ts">
import { ref } from 'vue'
import { Save, X, Pencil } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'
import ProfileImageSection from './ProfileImageSection.vue'
import ProfileForm from './ProfileForm.vue'

const props = defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  (e: 'update:profile', profile: Profile): void
}>()

const isEditing = ref(false)
const editedProfile = ref({ ...props.profile })

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    // 편집 모드 시작 시 현재 프로필 복사
    editedProfile.value = { ...props.profile }
  } else {
    // 편집 모드 취소 시 이미지 리셋
    editedProfile.value = { ...props.profile }
  }
}

const updateProfileImage = (imageUrl: string) => {
  editedProfile.value.imageUrl = imageUrl
}

const handleFormUpdate = (updates: Partial<Profile>) => {
  editedProfile.value = { ...editedProfile.value, ...updates }
}

const saveChanges = () => {
  const updatedProfile = { ...props.profile, ...editedProfile.value }
  emit('update:profile', updatedProfile)
  isEditing.value = false
}
</script>

<template>
  <div class="flex flex-col items-center relative">
    <!-- 프로필 이미지 섹션 -->
    <ProfileImageSection
      :image-url="profile.imageUrl"
      :default-image="defaultProfileImage"
      @update:image="updateProfileImage"
    />

    <!-- 프로필 폼 -->
    <ProfileForm
      :profile="isEditing ? editedProfile : profile"
      :is-editing="isEditing"
      @update:profile="handleFormUpdate"
    />

    <!-- 편집 버튼 -->
    <div class="flex justify-end gap-4 mt-8 w-full">
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
