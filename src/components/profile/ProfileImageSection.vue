<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Camera, Trash2 } from 'lucide-vue-next'
import { usePetStore } from '@/stores/petStore'
import Swal from 'sweetalert2'

const props = defineProps<{
  imageUrl: string | null
  defaultImage: string
  petId?: number // 현재 반려견의 ID
}>()

const emit = defineEmits<{
  (e: 'update:image', imageUrl: string): void
  (e: 'remove:image'): void
}>()

const petStore = usePetStore()
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const showRemoveButton = ref(false)

// 이미지 로드 함수
const loadImage = (id: number) => {
  const savedImage = localStorage.getItem(`pet_image_${id}`)
  if (savedImage) {
    imagePreview.value = savedImage
    emit('update:image', savedImage)
    showRemoveButton.value = true
    return true
  }
  showRemoveButton.value = false
  return false
}

// 펫 ID가 변경될 때마다 이미지 다시 로드
watch(
  () => props.petId,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      imagePreview.value = null // 기존 이미지 초기화
      if (newId) {
        loadImage(newId)
      }
    }
  },
  { immediate: true },
)

// Local Storage에서 이미지 불러오기
onMounted(() => {
  if (props.petId) {
    loadImage(props.petId)
  }
})

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedImage.value = input.files[0]

    // 최대 이미지 크기 제한 (2MB)
    if (input.files[0].size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: '파일 크기 초과',
        text: '이미지 크기가 2MB를 초과합니다. 더 작은 이미지를 선택해주세요.',
        confirmButtonText: '확인',
      })
      input.value = '' // 입력 초기화
      return
    }

    // 파일을 Base64로 변환
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      imagePreview.value = base64String
      showRemoveButton.value = true

      // Local Storage에 저장
      if (props.petId) {
        localStorage.setItem(`pet_image_${props.petId}`, base64String)

        // petStore 통해 이미지 업데이트
        emit('update:image', base64String)
      }
    }
    reader.readAsDataURL(input.files[0])
  }
}

const removeImage = () => {
  if (props.petId) {
    localStorage.removeItem(`pet_image_${props.petId}`)
    imagePreview.value = null
    showRemoveButton.value = false
    emit('remove:image')
  }
}
</script>

<template>
  <div class="relative mb-10 flex flex-col items-center">
    <div class="relative">
      <img
        :src="imagePreview || imageUrl || defaultImage"
        :alt="`${props.petId ? '반려견 프로필 이미지' : '기본 이미지'}`"
        class="w-32 h-32 rounded-full border-4 border-dang-primary object-cover shadow-dang-md"
      />

      <div class="absolute -bottom-2 right-0 flex items-center space-x-2">
        <!-- 이미지 변경 버튼 -->
        <label
          for="profile-image"
          class="bg-dang-primary text-white p-2 rounded-full cursor-pointer hover:bg-dang-secondary transition-colors z-10 shadow-dang-sm"
        >
          <Camera class="w-5 h-5" />
        </label>

        <!-- 이미지 제거 버튼 (항상 표시, 상태에 따라 스타일 변경) -->
        <button
          class="p-2 rounded-full z-10 shadow-dang-sm transition-all duration-300"
          :class="
            showRemoveButton
              ? 'bg-dang-light text-red-500 cursor-pointer hover:bg-red-100'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          "
          @click="showRemoveButton ? removeImage() : undefined"
          :disabled="!showRemoveButton"
          :title="showRemoveButton ? '이미지 삭제' : '삭제할 이미지가 없습니다'"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>

      <input
        type="file"
        id="profile-image"
        accept="image/*"
        class="hidden"
        @change="handleImageSelect"
      />
    </div>
  </div>
</template>
