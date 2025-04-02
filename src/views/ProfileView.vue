<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePetStore } from '@/stores/petStore'
import { UserCircle, Brain, Pencil } from 'lucide-vue-next'
import { saveAsPdf, copyCurrentUrl, shareToKakao } from '@/utils/shareUtils'

import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import DBTICard from '@/components/profile/DBTICard.vue'
import PetsitterGuideCard from '@/components/profile/PetsitterGuideCard.vue'
import ResultModal from '@/components/modals/ResultModal.vue'
import PetSelector from '@/components/profile/PetSelector.vue'
import FeatureCard from '@/components/profile/FeatureCard.vue'
import DBTIResultContent from '@/components/profile/DBTIResultContent.vue'
import PetsitterGuideContent from '@/components/profile/PetsitterGuideContent.vue'

const petStore = usePetStore()

const showDBTIResultModal = ref(false)
const showPetsitterGuideModal = ref(false)

onMounted(async () => {
  await petStore.fetchPets()
})

const handleSavePdf = () => {
  saveAsPdf('pdf-target', '댕댕로그-분석결과.pdf')
}

const handleCopyLink = () => {
  copyCurrentUrl()
}

const handleShareKakao = () => {
  const pet = petStore.currentPet
  const resultTitle = showDBTIResultModal.value
    ? 'DBTI 분석 결과'
    : '펫시터 가이드'
  const resultDescription = showDBTIResultModal.value
    ? pet?.pbti || 'DBTI 분석 결과'
    : pet?.petsitterGuide || '펫시터 가이드'

  shareToKakao(
    `${pet?.name}의 ${resultTitle}`,
    resultDescription,
    '@/assets/svgs/logo.svg',
  )
}
</script>

<template>
  <div
    class="min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="max-w-7xl w-full bg-dang-background rounded-2xl p-8 shadow-dang-lg relative border-t-4 border-dang-primary"
      >
        <div
          v-if="petStore.isLoading"
          class="flex justify-center items-center py-12"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-dang-primary"
          ></div>
        </div>

        <div
          v-else-if="petStore.error"
          class="flex flex-col items-center justify-center py-12"
        >
          <div class="text-dang-rejected-text text-lg mb-4">
            {{ petStore.error }}
          </div>
          <button
            @click="petStore.fetchPets"
            class="px-4 py-2 bg-dang-primary text-white rounded-lg hover:bg-dang-primary-dark transition-colors"
          >
            다시 시도
          </button>
        </div>

        <div
          v-else-if="petStore.pets.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <div class="text-_gray-500 text-lg mb-4">
            등록된 반려동물이 없습니다.
          </div>
        </div>

        <div v-else class="flex flex-col gap-8">
          <PetSelector
            :pets="petStore.pets"
            :current-pet-index="petStore.currentPetIndex"
            @switch="petStore.switchPet"
          />

          <div class="overflow-x-auto">
            <div class="grid grid-cols-3 gap-6 min-w-[56.25rem]">
              <FeatureCard
                :icon="UserCircle"
                title="반려동물 정보"
                color="dang-primary"
              >
                <ProfileInfo :profile="petStore.currentPet" />
              </FeatureCard>

              <FeatureCard
                :icon="Brain"
                title="DBTI 분석"
                color="chart-category2"
              >
                <DBTICard
                  :profile="petStore.currentPet"
                  @analyze="() => {}"
                  @show-result="showDBTIResultModal = true"
                />
              </FeatureCard>

              <FeatureCard
                :icon="Pencil"
                title="반려동물 가이드"
                color="chart-category3"
              >
                <PetsitterGuideCard
                  :profile="petStore.currentPet"
                  @generate="petStore.generatePetsitterGuide"
                  @show-guide="showPetsitterGuideModal = true"
                />
              </FeatureCard>
            </div>
          </div>
        </div>

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

    <ResultModal
      :show="showDBTIResultModal"
      title="DBTI 분석 결과"
      @close="showDBTIResultModal = false"
      @save-pdf="handleSavePdf"
      @share-kakao="handleShareKakao"
      @copy-link="handleCopyLink"
    >
      <DBTIResultContent :pet="petStore.currentPet" />
    </ResultModal>

    <ResultModal
      :show="showPetsitterGuideModal"
      title="반려동물 가이드"
      @close="showPetsitterGuideModal = false"
      @save-pdf="handleSavePdf"
      @share-kakao="handleShareKakao"
      @copy-link="handleCopyLink"
    >
      <PetsitterGuideContent :pet="petStore.currentPet" />
    </ResultModal>
  </div>
</template>
