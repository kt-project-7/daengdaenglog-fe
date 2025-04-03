<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGuideStore } from '@/stores/guideStore'
import { Guide } from '@/types/guide'
import GuideList from '@/components/guide/GuideList.vue'
import GuideDetail from '@/components/guide/GuideDetail.vue'

const guideStore = useGuideStore()

onMounted(() => {
  guideStore.loadGuides()
})

const guides = computed(() => guideStore.guides)
const isLoading = computed(() => guideStore.isLoading)
const error = computed(() => guideStore.error)
const selectedGuide = computed(() => {
  return guideStore.selectedGuide
})
const showDetailView = ref(false)

const viewGuideDetails = async (guide: Guide) => {
  try {
    await guideStore.loadGuideById(guide.guideId)

    if (guideStore.selectedGuide) {
      guideStore.selectedGuide = {
        ...guideStore.selectedGuide, // 기존 데이터 유지
        petName: guide.petName, // petName 추가
      }
    }

    showDetailView.value = true
  } catch (error) {
    console.error('Failed to load guide details:', error)
  }
}

const backToList = () => {
  showDetailView.value = false
}
</script>

<template>
  <div class="bg-dang-pending min-h-screen py-12">
    <div class="bg-white rounded-xl shadow-dang-md p-6 max-w-4xl mx-auto my-6">
      <GuideList
        v-if="!showDetailView"
        :guides="guides"
        :isLoading="isLoading"
        :error="error"
        @view-guide="viewGuideDetails"
      />

      <GuideDetail
        v-else
        :selectedGuide="selectedGuide"
        @back-to-list="backToList"
      />

      <!-- Decorative paw prints -->
      <div
        class="absolute bottom-5 left-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 -rotate-15 animate-bounce-custom"
      ></div>
      <div
        class="absolute bottom-5 right-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 rotate-15 animate-bounce-delay-2"
      ></div>
      <div
        class="absolute top-10 right-10 w-[2.5rem] h-[2.5rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 rotate-45 animate-bounce-delay-3"
      ></div>
      <div
        class="absolute top-20 left-20 w-[2rem] h-[2rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 -rotate-30 animate-bounce-delay-4"
      ></div>
    </div>
  </div>
</template>
