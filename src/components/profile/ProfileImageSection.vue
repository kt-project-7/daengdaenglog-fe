<script setup lang="ts">
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next'

defineProps<{
  imageUrl: string | null
  defaultImage: string
}>()

const emit = defineEmits<{
  (e: 'update:image', imageUrl: string): void
}>()

const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedImage.value = input.files[0]
    const imageUrl = URL.createObjectURL(input.files[0])
    imagePreview.value = imageUrl
    emit('update:image', imageUrl)
  }
}
</script>

<template>
  <div class="relative mb-10 flex flex-col items-center">
    <div class="relative">
      <img
        :src="imageUrl || defaultImage"
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
        type="file"
        id="profile-image"
        accept="image/*"
        class="hidden"
        @change="handleImageSelect"
      />
    </div>
  </div>
</template>
