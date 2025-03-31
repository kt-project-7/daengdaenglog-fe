<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { Dog, Cat, Brain, FileText, UserCircle } from 'lucide-vue-next'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import DBTICard from '@/components/profile/DBTICard.vue'
import PetsitterGuideCard from '@/components/profile/PetsitterGuideCard.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import AddPetModal from '@/components/modals/AddPetModal.vue'
import type { Profile } from '@/types/profile'
import defaultProfileImage from '@/assets/svgs/profile.svg'

const router = useRouter()
const profileStore = useProfileStore()
const authStore = useAuthStore()

// 로그인 모달 상태
const showLoginModal = ref(false)

// 반려동물 추가 모달 상태
const showAddPetModal = ref(false)

// 현재 선택된 반려동물 인덱스
const currentPetIndex = ref(0)

// 반려동물 목록 (예시 데이터)
const pets = ref<Profile[]>([
  {
    id: 1,
    name: '멍멍이',
    breed: '골든 리트리버',
    age: 3,
    gender: 'male',
    weight: 30,
    neutered: true,
    imageUrl: defaultProfileImage,
    dbtiResult: null,
    petsitterGuide: null,
  },
  {
    id: 2,
    name: '냥냥이',
    breed: '페르시안',
    age: 2,
    gender: 'female',
    weight: 4,
    neutered: true,
    imageUrl: defaultProfileImage,
    dbtiResult: null,
    petsitterGuide: null,
  },
])

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

// 로그인 처리
const handleLogin = (success: boolean) => {
  if (success) {
    authStore.login()
    showLoginModal.value = false
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  try {
    await profileStore.fetchProfile()
  } catch (error) {
    console.error('프로필 로딩 실패:', error)
  }
})

const updateProfile = (updatedProfile: Profile) => {
  profileStore.updateProfile(updatedProfile)
  // 현재 반려동물 정보 업데이트
  pets.value[currentPetIndex.value] = updatedProfile
}

const analyzeDogPersonality = async () => {
  try {
    await profileStore.analyzeDogPersonality()
  } catch (error) {
    console.error('DBTI 분석 실패:', error)
  }
}

const generatePetsitterGuide = async () => {
  try {
    await profileStore.generatePetsitterGuide()
  } catch (error) {
    console.error('펫시터 가이드 생성 실패:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-_gray-100 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl w-full bg-white rounded-2xl p-8 shadow-lg relative">
        <div class="flex flex-col gap-8">
          <!-- 반려동물 선택 -->
          <div class="flex items-center justify-between">
            <div class="flex gap-4">
              <button
                v-for="(pet, index) in pets"
                :key="pet.id"
                class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                :class="[
                  currentPetIndex === index
                    ? 'bg-primary text-white'
                    : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200',
                ]"
                @click="switchPet(index)"
              >
                <Dog
                  v-if="pet.breed.toLowerCase().includes('리트리버')"
                  class="w-5 h-5"
                />
                <Cat v-else class="w-5 h-5" />
                {{ pet.name }}
              </button>
            </div>
            <button
              class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              @click="showAddPetModal = true"
            >
              <UserCircle class="w-5 h-5" />
              반려동물 추가
            </button>
          </div>

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
                  <h2 class="text-2xl text-gray-700 font-bold">
                    반려동물 정보
                  </h2>
                </div>
                <ProfileInfo
                  :profile="pets[currentPetIndex]"
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
                  :profile="pets[currentPetIndex]"
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
                  <h2 class="text-2xl text-gray-700 font-bold">
                    펫시터 가이드
                  </h2>
                </div>
                <PetsitterGuideCard
                  :profile="pets[currentPetIndex]"
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
    </div>

    <!-- 로그인 모달 -->
    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLogin"
    />

    <!-- 반려동물 추가 모달 -->
    <AddPetModal
      v-if="showAddPetModal"
      :show="showAddPetModal"
      @close="showAddPetModal = false"
      @add="addPet"
    />
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
