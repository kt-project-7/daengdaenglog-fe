<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useProfileStore } from '@/stores/profileStore'
import { UserCircle, Brain, Pencil } from 'lucide-vue-next'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import DBTICard from '@/components/profile/DBTICard.vue'
import PetsitterGuideCard from '@/components/profile/PetsitterGuideCard.vue'
import AddPetModal from '@/components/modals/AddPetModal.vue'
import ResultModal from '@/components/modals/ResultModal.vue'
import PetSelector from '@/components/profile/PetSelector.vue'
import FeatureCard from '@/components/profile/FeatureCard.vue'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'
import html2pdf from 'html2pdf.js'

const profileStore = useProfileStore()

// 모달 상태
const showAddPetModal = ref(false)
const showDBTIResultModal = ref(false)
const showPetsitterGuideModal = ref(false)

// 현재 선택된 반려동물 인덱스
const currentPetIndex = ref(0)

// 반려동물 목록 (빈 배열로 초기화)
const pets = ref<Profile[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// 반려동물 데이터 가져오기
const fetchPets = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await axios.get('https://dangdanglog.com/pet/', {
      headers: {
        'accept': '*/*',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NDM0ODY0MjIsImV4cCI6MTc0MzUyMjQyMiwiaXNzIjoiY2xvdmVyIiwic3ViIjoiMSIsInJvbGUiOiJBRE1JTiJ9.g6U0bHwq7oNi-gLbYxWZzjzN6Y1hF1uZqRgE7Jx7ObWUetN81O_x4IUVfXksQHckH9NEFjd_cf501575OU9BGg'
      }
    })
    
    // API 응답 데이터를 pets에 할당
    pets.value = response.data
    
    // 반려동물이 있으면 첫 번째 반려동물을 선택
    if (pets.value.length > 0) {
      switchPet(0)
    }
  } catch (err) {
    console.error('반려동물 데이터 가져오기 실패:', err)
    error.value = '반려동물 데이터를 가져오는데 실패했습니다.'
    
    // 에러 발생 시 빈 배열로 초기화
    pets.value = []
  } finally {
    isLoading.value = false
  }
}

// 반려동물 전환 함수
const switchPet = (index: number) => {
  currentPetIndex.value = index
  profileStore.setProfile(pets.value[index])
}

// 반려동물 추가 함수
const addPet = (newPet: Profile) => {
  newPet.id = pets.value.length + 1
  pets.value.push(newPet)
  switchPet(pets.value.length - 1)
  profileStore.setProfile(newPet)
}

onMounted(async () => {
  try {
    // 반려동물 데이터 가져오기
    await fetchPets()
    
    // 프로필 스토어 데이터 가져오기
    await profileStore.fetchProfile()
  } catch (error) {
    console.error('프로필 로딩 실패:', error)
  }
})

// const updateProfile = (updatedProfile: Profile) => {
//   profileStore.updateProfile(updatedProfile)
//   // 현재 반려동물 정보 업데이트
//   pets.value[currentPetIndex.value] = updatedProfile
// }

const analyzeDogPersonality = async () => {
  try {
    await profileStore.analyzeDogPersonality()
    // 현재 반려동물 정보 업데이트
    pets.value[currentPetIndex.value].dbtiResult =
      profileStore.profile.dbtiResult
  } catch (error) {
    console.error('DBTI 분석 실패:', error)
  }
}

const generatePetsitterGuide = async () => {
  try {
    await profileStore.generatePetsitterGuide()
    // 현재 반려동물 정보 업데이트
    pets.value[currentPetIndex.value].petsitterGuide =
      profileStore.profile.petsitterGuide
  } catch (error) {
    console.error('펫시터 가이드 생성 실패:', error)
  }
}

// 모달 관련 함수들
const showDBTIResult = () => {
  showDBTIResultModal.value = true
}

const showPetsitterGuide = () => {
  showPetsitterGuideModal.value = true
}

const handleSavePdf = () => {
  const el = document.getElementById('pdf-target')
  if (!el) return

  html2pdf()
    .set({
      margin: 10,
      filename: '댕댕로그-분석결과.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(el)
    .save()
}

const handleShareKakao = () => {
  // 카카오 SDK가 로드되었는지 확인
  if (!window.Kakao) {
    alert('카카오톡 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.')
    return
  }

  // 카카오 SDK 초기화가 필요한 경우 (한 번만 호출해야 함)
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY)
  }

  const petName = pets.value[currentPetIndex.value].name
  const resultTitle = showDBTIResultModal.value
    ? 'DBTI 분석 결과'
    : '펫시터 가이드'
  const resultDescription = showDBTIResultModal.value
    ? pets.value[currentPetIndex.value].dbtiResult?.description ||
      'DBTI 분석 결과'
    : pets.value[currentPetIndex.value].petsitterGuide?.generalInfo ||
      '펫시터 가이드'

  // 카카오 공유하기 API 호출
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${petName}의 ${resultTitle}`,
      description: resultDescription,
      imageUrl: '@/assets/svgs/logo.svg', // 대표 이미지 URL로 변경 필요
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    },
    buttons: [
      {
        title: '결과 확인하기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    ],
  })
}

const handleCopyLink = () => {
  // 현재 페이지 URL을 클립보드에 복사
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert('URL이 클립보드에 복사되었습니다.')
    })
    .catch((err) => {
      console.error('URL 복사 실패:', err)
      alert('URL 복사에 실패했습니다.')
    })
}
</script>

<template>
  <div class="min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="max-w-7xl w-full bg-dang-background rounded-2xl p-8 shadow-dang-lg relative border-t-4 border-dang-primary"
      >
        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-dang-primary"></div>
        </div>
        
        <!-- 에러 메시지 표시 -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
          <div class="text-dang-rejected-text text-lg mb-4">{{ error }}</div>
          <button 
            @click="fetchPets" 
            class="px-4 py-2 bg-dang-primary text-white rounded-lg hover:bg-dang-primary-dark transition-colors"
          >
            다시 시도
          </button>
        </div>
        
        <!-- 반려동물 데이터가 없는 경우 -->
        <div v-else-if="pets.length === 0" class="flex flex-col items-center justify-center py-12">
          <div class="text-_gray-500 text-lg mb-4">등록된 반려동물이 없습니다.</div>
          <button 
            @click="showAddPetModal = true" 
            class="px-4 py-2 bg-dang-primary text-white rounded-lg hover:bg-dang-primary-dark transition-colors"
          >
            반려동물 추가하기
          </button>
        </div>
        
        <!-- 반려동물 데이터가 있는 경우 -->
        <div v-else class="flex flex-col gap-8">
          <!-- 반려동물 선택 컴포넌트 -->
          <PetSelector
            :pets="pets"
            :current-pet-index="currentPetIndex"
            @switch="switchPet"
            @add="showAddPetModal = true"
          />

          <!-- 기능 카드 -->
          <div class="overflow-x-auto">
            <div class="grid grid-cols-3 gap-6 min-w-[56.25rem]">
              <!-- 프로필 정보 -->
              <FeatureCard
                :icon="UserCircle"
                title="반려동물 정보"
                color="dang-primary"
              >
                <ProfileInfo
                  :profile="pets[currentPetIndex]" 
                />
              </FeatureCard>

              <!-- DBTI 분석 카드 -->
              <FeatureCard :icon="Brain" title="DBTI 분석" color="chart-category2">
                <DBTICard
                  :profile="pets[currentPetIndex]"
                  @analyze="analyzeDogPersonality"
                  @show-result="showDBTIResult"
                />
              </FeatureCard>

              <!-- 펫시터 가이드 카드 -->
              <FeatureCard
                :icon="Pencil"
                title="펫시터 가이드"
                color="chart-category3"
              >
                <PetsitterGuideCard
                  :profile="pets[currentPetIndex]"
                  @generate="generatePetsitterGuide"
                  @show-guide="showPetsitterGuide"
                />
              </FeatureCard>
            </div>
          </div>
        </div>

        <!-- 발자국 장식 -->
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

    <!-- 반려동물 추가 모달 -->
    <AddPetModal
      v-if="showAddPetModal"
      :show="showAddPetModal"
      @close="showAddPetModal = false"
      @add="addPet"
    />

    <!-- DBTI 결과 모달 -->
    <ResultModal
      :show="showDBTIResultModal"
      title="DBTI 분석 결과"
      @close="showDBTIResultModal = false"
      @save-pdf="handleSavePdf"
      @share-kakao="handleShareKakao"
      @copy-link="handleCopyLink"
    >
      <div class="space-y-6" v-if="pets.length > 0 && pets[currentPetIndex].dbtiResult">
        <div class="text-center mb-6">
          <div class="inline-block p-4 bg-chart-category2 bg-opacity-20 rounded-full mb-4">
            <Brain class="w-12 h-12 text-chart-category2" />
          </div>
          <h3 class="text-2xl font-bold text-chart-category2">
            {{ pets[currentPetIndex].dbtiResult?.type }}
          </h3>
          <p class="text-lg text-_gray-500 mt-2">
            {{ pets[currentPetIndex].name }}의 DBTI 결과
          </p>
        </div>

        <div class="bg-chart-category2 bg-opacity-10 rounded-xl p-6 border border-chart-category2 border-opacity-20">
          <h4 class="text-xl font-bold text-chart-category2 mb-4">성격 분석</h4>
          <p class="text-_gray-700 leading-relaxed text-lg">
            {{ pets[currentPetIndex].dbtiResult?.description }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-dang-light rounded-xl p-5 border border-chart-category2 border-opacity-20">
            <h4 class="text-lg font-bold text-chart-category2 mb-3">특징</h4>
            <ul class="space-y-2 text-_gray-600">
              <li class="flex items-start gap-2">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2"
                ></span>
                활발하고 사교적인 성격
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2"
                ></span>
                새로운 환경과 사람에 호기심이 많음
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2"
                ></span>
                놀이와 활동에 대한 열정이 넘침
              </li>
            </ul>
          </div>

          <div class="bg-dang-light rounded-xl p-5 border border-chart-category3 border-opacity-20">
            <h4 class="text-lg font-bold text-chart-category3 mb-3">양육 팁</h4>
            <ul class="space-y-2 text-_gray-600">
              <li class="flex items-start gap-2">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2"
                ></span>
                충분한 운동과 놀이 시간 제공
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2"
                ></span>
                다양한 사회화 경험 제공
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2"
                ></span>
                일관된 규칙과 훈련 제공
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ResultModal>

    <!-- 펫시터 가이드 결과 모달 -->
    <ResultModal
      :show="showPetsitterGuideModal"
      title="펫시터 가이드"
      @close="showPetsitterGuideModal = false"
      @save-pdf="handleSavePdf"
      @share-kakao="handleShareKakao"
      @copy-link="handleCopyLink"
    >
      <div class="space-y-6" v-if="pets.length > 0 && pets[currentPetIndex].petsitterGuide">
        <div class="text-center mb-6">
          <div class="inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4">
            <Pencil class="w-12 h-12 text-chart-category3" />
          </div>
          <h3 class="text-2xl font-bold text-chart-category3">
            {{ pets[currentPetIndex].name }}의 펫시터 가이드
          </h3>
          <p class="text-lg text-_gray-500 mt-2">
            아래 가이드를 펫시터에게 전달하세요
          </p>
        </div>

        <div class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20">
          <h4 class="text-xl font-bold text-chart-category3 mb-4">기본 정보</h4>
          <p class="text-_gray-700 leading-relaxed text-lg">
            {{ pets[currentPetIndex].petsitterGuide?.generalInfo }}
          </p>
        </div>

        <div class="bg-dang-light rounded-xl p-6 border border-chart-category4 border-opacity-30">
          <h4 class="text-xl font-bold text-chart-category4 mb-4">일상 생활</h4>
          <p class="text-_gray-700 leading-relaxed">
            {{ pets[currentPetIndex].petsitterGuide?.routineInfo }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-dang-light rounded-xl p-5 border border-chart-category1 border-opacity-20">
            <h4 class="text-lg font-bold text-chart-category1 mb-3">식사 관련</h4>
            <p class="text-_gray-600">
              {{ pets[currentPetIndex].petsitterGuide?.feedingInfo }}
            </p>
          </div>

          <div class="bg-dang-light rounded-xl p-5 border border-chart-category5 border-opacity-30">
            <h4 class="text-lg font-bold text-chart-category1 mb-3">건강 관련</h4>
            <p class="text-_gray-600">
              {{ pets[currentPetIndex].petsitterGuide?.healthInfo }}
            </p>
          </div>
        </div>

        <div class="bg-dang-approved rounded-xl p-6 border border-dang-approved-text border-opacity-20">
          <h4 class="text-xl font-bold text-dang-approved-text mb-4">특별 주의사항</h4>
          <ul class="space-y-2 text-_gray-600">
            <li
              class="flex items-start gap-2"
              v-for="(note, index) in pets[currentPetIndex].petsitterGuide
                ?.specialNotes"
              :key="index"
            >
              <span
                class="inline-block w-2 h-2 rounded-full bg-dang-rejected-text mt-2"
              ></span>
              {{ note }}
            </li>
          </ul>
        </div>
      </div>
    </ResultModal>
  </div>
</template>

<style>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

@media print {
  .min-h-screen {
    background-color: white;
    padding: 0;
  }

  /* Hide interactive elements */
  .fixed,
  .absolute,
  .flex,
  .grid,
  .bg-background,
  .bg-black\/50,
  .shadow-dang-lg,
  .hover\:scale-120,
  .hover\:-translate-y-1,
  .hover\:shadow-md,
  .hover\:bg-_gray-100,
  .hover\:bg-_gray-700,
  .hover\:bg-dang-secondary,
  .transition-transform,
  .transition-colors,
  .animate-slide-up {
    display: none !important;
  }

  /* Reset styles for print */
  .bg-white {
    box-shadow: none !important;
  }

  .border-t-4 {
    border-top-width: 2px !important;
  }

  .text-dang-primary {
    color: black !important;
  }

  .border-b {
    border-bottom-color: black !important;
  }
}
</style>