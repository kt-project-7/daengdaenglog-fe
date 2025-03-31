import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile } from '@/types/profile'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({
    id: 1,
    name: '',
    breed: '',
    age: 0,
    weight: 0,
    gender: 'male',
    neutered: false,
    imageUrl: null,
    dbtiResult: null,
    petsitterGuide: null,
  })

  const setProfile = (newProfile: Profile) => {
    profile.value = newProfile
  }

  const updateProfile = (updatedProfile: Profile) => {
    profile.value = updatedProfile
  }

  const analyzeDogPersonality = async () => {
    // API 호출 로직
    profile.value.dbtiResult = {
      type: 'ENFP',
      description: '친근하고 활발한 성격의 강아지입니다.',
    }
  }

  const generatePetsitterGuide = async () => {
    // API 호출 로직
    profile.value.petsitterGuide = {
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
    }
  }

  const fetchProfile = async () => {
    // API 호출 로직
    profile.value = {
      id: 1,
      name: '멍멍이',
      breed: '골든 리트리버',
      age: 3,
      weight: 30,
      gender: 'male',
      neutered: true,
      imageUrl: '/default-profile.png',
      dbtiResult: null,
      petsitterGuide: null,
    }
  }

  return {
    profile,
    setProfile,
    updateProfile,
    analyzeDogPersonality,
    generatePetsitterGuide,
    fetchProfile,
  }
})
