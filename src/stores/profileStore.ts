import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile } from '@/types/profile'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({
    id: 1,
    name: '',
    petType: '',
    age: 0,
    weight: 0,
    gender: 'male',
    neutered: false,
    imageUrl: null,
    pbti: null,
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
    profile.value.pbti = 'ENFP'
  }

  const generatePetsitterGuide = async () => {
    // API 호출 로직
    profile.value.petsitterGuide = `${profile.value.name}는 ${profile.value.petType} 품종으로, ${profile.value.age}세 ${profile.value.gender === 'male' ? '수컷' : '암컷'}입니다. 체중은 ${profile.value.weight}kg이며, ${profile.value.neutered ? '중성화가 되어있습니다.' : '중성화가 되어있지 않습니다.'}`
  }

  const fetchProfile = async () => {
    // API 호출 로직
    profile.value = {
      id: 1,
      name: '멍멍이',
      petType: '골든 리트리버',
      age: 3,
      weight: 30,
      gender: 'male',
      neutered: true,
      imageUrl: '/default-profile.png',
      pbti: null,
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
