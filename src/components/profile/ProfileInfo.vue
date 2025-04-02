<script setup lang="ts">
import { ref } from 'vue'
import { Save, X, Pencil } from 'lucide-vue-next'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'
import ProfileImageSection from './ProfileImageSection.vue'
import ProfileForm from './ProfileForm.vue'
import { usePetStore } from '@/stores/petStore'

const props = defineProps<{
  profile: Profile
}>()

const petStore = usePetStore()
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
  // petStore를 통해 이미지 업데이트
  petStore.updatePetImage(imageUrl)
}

const removeProfileImage = () => {
  // 프로필 이미지 제거
  editedProfile.value.imageUrl = null
  // petStore를 통해 이미지 제거
  petStore.removePetImage()
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
      :image-url="profile?.imageUrl || defaultProfileImage"
      :default-image="defaultProfileImage"
      :pet-id="profile.id"
      @update:image="updateProfileImage"
      @remove:image="removeProfileImage"
    />

    <!-- 프로필 폼 -->
    <ProfileForm
      :profile="isEditing ? editedProfile : profile"
      :is-editing="isEditing"
      @update:profile="handleFormUpdate"
    />
  </div>
</template>
