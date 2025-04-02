// src/stores/petStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Profile } from '@/types/profile'
import { fetchPets as fetchPetsFromAPI } from '@/apis/pet'

export const usePetStore = defineStore('pet', () => {
  const pets = ref<Profile[]>([])
  const currentPetIndex = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentPet = computed(() => pets.value[currentPetIndex.value])

  const fetchPets = async () => {
    isLoading.value = true
    error.value = null
    try {
      const petsData = await fetchPetsFromAPI()
      pets.value = petsData
      if (pets.value.length > 0) {
        currentPetIndex.value = 0
      }
    } catch (err) {
      console.error('반려동물 데이터 가져오기 실패:', err)
      error.value = '반려동물 데이터를 가져오는데 실패했습니다.'
      pets.value = []
    } finally {
      isLoading.value = false
    }
  }

  const switchPet = (index: number) => {
    if (index >= 0 && index < pets.value.length) {
      currentPetIndex.value = index
    }
  }

  const addPet = (newPet: Profile) => {
    newPet.id = pets.value.length + 1
    pets.value.push(newPet)
    currentPetIndex.value = pets.value.length - 1
  }

  // DBTI 분석 결과를 직접 업데이트하는 함수
  const updatePetPbti = (pbtiValue: string) => {
    if (currentPet.value) {
      pets.value[currentPetIndex.value].pbti = pbtiValue
    }
  }

  const generatePetsitterGuide = async () => {
    const pet = pets.value[currentPetIndex.value]
    pet.petsitterGuide = `${pet.name}는 ${pet.petType} 품종으로, ${pet.age}세 ${pet.gender === 'male' ? '수컷' : '암컷'}입니다. 체중은 ${pet.weight}kg이며, ${pet.neutered ? '중성화가 되어있습니다.' : '중성화가 되어있지 않습니다.'}`
  }

  return {
    pets,
    currentPetIndex,
    currentPet,
    isLoading,
    error,
    fetchPets,
    switchPet,
    addPet,
    updatePetPbti,
    generatePetsitterGuide,
  }
})
