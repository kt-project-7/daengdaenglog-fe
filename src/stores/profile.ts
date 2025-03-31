import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile } from '@/types/profile'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({
    name: '댕댕이',
    breed: '골든 리트리버',
    age: 3,
    weight: 30,
    gender: 'male',
    neutered: true,
    imageUrl: null,
    dbtiResult: null,
  })

  const updateProfile = (updatedProfile: Profile) => {
    profile.value = { ...updatedProfile }
  }

  const analyzeDogPersonality = () => {
    // 실제 구현에서는 API 호출 등을 통해 DBTI 분석 결과를 받아옴
    profile.value.dbtiResult = {
      type: '활발한 친구',
      description:
        '활발하고 친근한 성격의 강아지입니다. 다른 강아지들과 잘 어울리며, 새로운 환경에 적응하는 것을 좋아합니다.',
    }
  }

  const generatePetsitterGuide = () => {
    // 실제 구현에서는 API 호출 등을 통해 펫시터 가이드를 생성
    return {
      success: true,
      message: '펫시터 가이드가 생성되었습니다.',
    }
  }

  return {
    profile,
    updateProfile,
    analyzeDogPersonality,
    generatePetsitterGuide,
  }
})
