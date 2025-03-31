<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import DBTICard from '@/components/profile/DBTICard.vue'
import PetsitterGuideCard from '@/components/profile/PetsitterGuideCard.vue'
import {
  Dog,
  Cat,
  UserCircle,
  Brain,
  FileText,
  X,
  Printer,
  Download,
  Check,
} from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

const profileStore = useProfileStore()
const showGuideModal = ref(false)
const isLoading = ref(false)
const showUpdateNotification = ref(false)

// 펫시터 가이드 데이터 (실제로는 API에서 받아올 데이터)
const petsitterGuide = ref({
  meals: {
    frequency: '2',
    amount: '1컵(200g)',
    schedule: '아침 8시, 저녁 6시에 급여해주세요',
    preferences: '습식 사료를 더 좋아합니다',
    restrictions: '닭고기 알러지가 있으니 주의해주세요',
  },
  walks: {
    frequency: '2',
    duration: '30분 정도가 적당합니다',
    bestTime: '아침과 저녁 시간대를 선호합니다',
    preferences: '공원에서 뛰어노는 것을 좋아합니다',
  },
  specialNotes: [
    '낯선 사람을 무서워하니 천천히 다가가주세요',
    '배를 만져주는 것을 좋아합니다',
    '다른 강아지를 만나면 흥분하니 주의해주세요',
    '장난감 중 노란 공을 가장 좋아합니다',
  ],
  emergencyTips: [
    '구토나 설사가 지속되면 즉시 동물병원에 연락해주세요',
    '가까운 24시간 동물병원: 댕댕 동물병원 (02-123-4567)',
    '평소 복용 중인 약: 없음',
    '주치의: 김철수 수의사 (010-9876-5432)',
  ],
})

// 프로필 업데이트 처리
const updateProfile = (updatedProfile: Profile) => {
  profileStore.updateProfile(updatedProfile)
  showUpdateNotification.value = true
  setTimeout(() => {
    showUpdateNotification.value = false
  }, 3000)
}

// DBTI 분석
const analyzeDogPersonality = () => {
  profileStore.analyzeDogPersonality()
}

// 펫시터 가이드 생성
const generatePetsitterGuide = () => {
  isLoading.value = true
  showGuideModal.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

// 가이드 모달 닫기
const closeGuideModal = () => {
  showGuideModal.value = false
}

// 가이드 인쇄
const printGuide = () => {
  window.print()
}

// 가이드 PDF 다운로드
const downloadGuide = () => {
  alert('PDF가 다운로드되었습니다.')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-8 bg-[#fff9e9]">
    <div class="flex flex-col items-center mb-8 relative w-full">
      <h1 class="text-4xl text-[#f59e0b] text-center mb-4 font-bold relative">
        댕댕이 프로필
        <span
          class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[150px] h-[3px] bg-[#f59e0b] rounded"
        ></span>
      </h1>
      <div class="flex gap-6 mt-6">
        <Dog
          class="w-10 h-10 text-[#f59e0b] transition-transform hover:scale-120"
        />
        <Cat
          class="w-10 h-10 text-gray-600 transition-transform hover:scale-120"
        />
      </div>
    </div>

    <div class="max-w-7xl w-full bg-white rounded-2xl p-8 shadow-lg relative">
      <div class="flex flex-col gap-8">
        <!-- 기능 카드 -->
        <div class="overflow-x-auto">
          <div class="grid grid-cols-3 gap-6 min-w-[900px]">
            <!-- 프로필 정보 -->
            <div
              class="bg-[#fff9e9] rounded-xl p-6 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md border-t-4 border-t-[#f59e0b]"
            >
              <div
                class="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#f59e0b]"
              >
                <UserCircle class="w-7 h-7 text-[#f59e0b]" />
                <h2 class="text-2xl text-gray-700 font-bold">반려동물 정보</h2>
              </div>
              <ProfileInfo
                :profile="profileStore.profile"
                @update:profile="updateProfile"
              />
            </div>

            <!-- DBTI 분석 카드 -->
            <div
              class="bg-[#fff9e9] rounded-xl p-6 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md border-t-4 border-t-blue-400"
            >
              <div
                class="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#f59e0b]"
              >
                <Brain class="w-7 h-7 text-[#f59e0b]" />
                <h2 class="text-2xl text-gray-700 font-bold">DBTI 분석</h2>
              </div>
              <DBTICard
                :profile="profileStore.profile"
                @analyze="analyzeDogPersonality"
              />
            </div>

            <!-- 펫시터 가이드 카드 -->
            <div
              class="bg-[#fff9e9] rounded-xl p-6 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md border-t-4 border-t-green-500"
            >
              <div
                class="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#f59e0b]"
              >
                <FileText class="w-7 h-7 text-[#f59e0b]" />
                <h2 class="text-2xl text-gray-700 font-bold">펫시터 가이드</h2>
              </div>
              <PetsitterGuideCard
                :profile="profileStore.profile"
                @generate="generatePetsitterGuide"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 발자국 장식 -->
      <div
        class="absolute bottom-5 left-5 w-[60px] h-[60px] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 -rotate-15"
      ></div>
      <div
        class="absolute bottom-5 right-5 w-[60px] h-[60px] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 rotate-15"
      ></div>
    </div>

    <!-- 펫시터 가이드 모달 -->
    <div
      v-if="showGuideModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeGuideModal"
    >
      <div
        class="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div
          class="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10"
        >
          <h2 class="text-3xl text-[#f59e0b] font-bold">
            {{ profileStore.profile.name }}의 펫시터 가이드
          </h2>
          <button
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            @click="closeGuideModal"
          >
            <X class="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div class="p-6 flex-grow">
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-12"
          >
            <div
              class="w-12 h-12 border-4 border-gray-200 border-t-[#f59e0b] rounded-full animate-spin mb-4"
            ></div>
            <p class="text-gray-600">가이드 생성 중...</p>
          </div>
          <div v-else>
            <div class="mb-8">
              <h3 class="text-xl text-gray-700 font-bold mb-4 pb-2 border-b">
                기본 정보
              </h3>
              <div class="flex items-center gap-8">
                <div class="flex-1">
                  <p><strong>이름:</strong> {{ profileStore.profile.name }}</p>
                  <p><strong>품종:</strong> {{ profileStore.profile.breed }}</p>
                  <p><strong>나이:</strong> {{ profileStore.profile.age }}세</p>
                  <p>
                    <strong>성별:</strong>
                    {{
                      profileStore.profile.gender === 'male' ? '남아' : '여아'
                    }}
                  </p>
                  <p>
                    <strong>몸무게:</strong> {{ profileStore.profile.weight }}kg
                  </p>
                  <p>
                    <strong>중성화:</strong>
                    {{ profileStore.profile.neutered ? '완료' : '미완료' }}
                  </p>
                </div>
                <div class="flex justify-center items-center">
                  <img
                    src="@/assets/svgs/profile.svg"
                    alt="반려동물 이미지"
                    class="w-30 h-30 rounded-full border-4 border-[#f59e0b]"
                  />
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-xl text-gray-700 font-bold mb-4 pb-2 border-b">
                식사 가이드
              </h3>
              <ul class="list-disc pl-6 space-y-2">
                <li>
                  하루 {{ petsitterGuide.meals.frequency }}회 급여 ({{
                    petsitterGuide.meals.amount
                  }})
                </li>
                <li>{{ petsitterGuide.meals.schedule }}</li>
                <li>{{ petsitterGuide.meals.preferences }}</li>
                <li>{{ petsitterGuide.meals.restrictions }}</li>
              </ul>
            </div>

            <div class="mb-8">
              <h3 class="text-xl text-gray-700 font-bold mb-4 pb-2 border-b">
                산책 가이드
              </h3>
              <ul class="list-disc pl-6 space-y-2">
                <li>하루 {{ petsitterGuide.walks.frequency }}회 산책</li>
                <li>{{ petsitterGuide.walks.duration }}</li>
                <li>{{ petsitterGuide.walks.bestTime }}</li>
                <li>{{ petsitterGuide.walks.preferences }}</li>
              </ul>
            </div>

            <div class="mb-8">
              <h3 class="text-xl text-gray-700 font-bold mb-4 pb-2 border-b">
                특이사항
              </h3>
              <ul class="list-disc pl-6 space-y-2">
                <li
                  v-for="(note, index) in petsitterGuide.specialNotes"
                  :key="index"
                >
                  {{ note }}
                </li>
              </ul>
            </div>

            <div class="mb-8">
              <h3 class="text-xl text-gray-700 font-bold mb-4 pb-2 border-b">
                응급 상황 대처법
              </h3>
              <ul class="list-disc pl-6 space-y-2">
                <li
                  v-for="(tip, index) in petsitterGuide.emergencyTips"
                  :key="index"
                >
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          class="flex justify-end gap-4 p-6 border-t sticky bottom-0 bg-white rounded-b-2xl"
        >
          <button
            class="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
            @click="printGuide"
          >
            <Printer class="w-5 h-5" />
            인쇄하기
          </button>
          <button
            class="flex items-center gap-2 px-6 py-3 bg-[#f59e0b] text-white rounded-lg font-bold hover:bg-[#d97706] transition-colors"
            @click="downloadGuide"
          >
            <Download class="w-5 h-5" />
            PDF 저장
          </button>
        </div>
      </div>
    </div>

    <!-- 프로필 업데이트 알림 -->
    <div
      v-if="showUpdateNotification"
      class="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-up"
    >
      <div class="flex items-center gap-3">
        <Check class="w-5 h-5" />
        <span>프로필이 성공적으로 업데이트되었습니다!</span>
      </div>
    </div>
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
  .bg-\[#fff9e9\],
  .bg-black\/50,
  .shadow-lg,
  .hover\:scale-120,
  .hover\:-translate-y-1,
  .hover\:shadow-md,
  .hover\:bg-gray-100,
  .hover\:bg-gray-700,
  .hover\:bg-\[#d97706\],
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

  .text-\[#f59e0b\] {
    color: black !important;
  }

  .border-b {
    border-bottom-color: black !important;
  }
}
</style>
