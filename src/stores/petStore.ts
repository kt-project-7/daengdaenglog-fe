// src/stores/petStore.ts
import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import type { Profile } from '@/types/profile'
import { fetchPets as fetchPetsFromAPI } from '@/apis/pet'

export const usePetStore = defineStore('pet', () => {
  const pets = ref<Profile[]>([])
  const currentPetIndex = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentPet = computed(() => pets.value[currentPetIndex.value])

  // 로컬 스토리지에서 특정 펫의 이미지 불러오기
  const loadPetImage = (petId: number) => {
    const savedImage = localStorage.getItem(`pet_image_${petId}`)
    if (savedImage) {
      const pet = pets.value.find((p) => p.id === petId)
      if (pet) {
        pet.imageUrl = savedImage
        return true
      }
    }
    return false
  }

  // 로컬 스토리지에서 모든 이미지 불러오기
  const loadStoredImages = () => {
    pets.value.forEach((pet) => {
      loadPetImage(pet.id)
    })
  }

  // 로컬 스토리지에 이미지 저장
  const savePetImage = (petId: number, imageUrl: string) => {
    localStorage.setItem(`pet_image_${petId}`, imageUrl)
    const pet = pets.value.find((p) => p.id === petId)
    if (pet) {
      pet.imageUrl = imageUrl
    }
  }

  // 로컬 스토리지에서 이미지 삭제
  const deletePetImage = (petId: number) => {
    localStorage.removeItem(`pet_image_${petId}`)
    const pet = pets.value.find((p) => p.id === petId)
    if (pet) {
      pet.imageUrl = null
    }
  }

  const fetchPets = async () => {
    isLoading.value = true
    error.value = null
    try {
      const petsData = await fetchPetsFromAPI()
      pets.value = petsData
      if (pets.value.length > 0) {
        currentPetIndex.value = 0
      }
      // 이미지 로드
      loadStoredImages()
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

  // 반려동물 이미지 업데이트 함수
  const updatePetImage = (imageUrl: string) => {
    if (currentPet.value) {
      savePetImage(currentPet.value.id, imageUrl)
    }
  }

  // 반려동물 이미지 제거 함수
  const removePetImage = () => {
    if (currentPet.value) {
      deletePetImage(currentPet.value.id)
    }
  }

  // DBTI 분석 결과를 직접 업데이트하는 함수
  const updatePetPbti = (pbtiValue: string) => {
    if (currentPet.value) {
      pets.value[currentPetIndex.value].pbti = pbtiValue
    }
  }

  const generatePetsitterGuide = async () => {
    const pet = pets.value[currentPetIndex.value]
    pet.petsitterGuide = `${pet.name}는 ${pet.breed} 품종으로, ${pet.age}세 ${pet.gender === 'male' ? '수컷' : '암컷'}입니다. 체중은 ${pet.weight}kg이며, ${pet.neutered ? '중성화가 되어있습니다.' : '중성화가 되어있지 않습니다.'}`
  }

  // 펫이 삭제될 때 이미지도 함께 삭제
  const removePet = (petId: number) => {
    deletePetImage(petId)
    pets.value = pets.value.filter((pet) => pet.id !== petId)
    if (pets.value.length === 0) {
      currentPetIndex.value = 0
    } else if (currentPetIndex.value >= pets.value.length) {
      currentPetIndex.value = pets.value.length - 1
    }
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
    removePet,
    updatePetImage,
    removePetImage,
    updatePetPbti,
    generatePetsitterGuide,
    loadPetImage,
  }
})
