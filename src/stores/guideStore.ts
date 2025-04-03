import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchGuides, getGuideById, createGuide } from '@/apis/guide'
import { Guide, GuideDetail, GuideRequest } from '@/types/guide'

export const useGuideStore = defineStore('guideStore', () => {
  const guides = ref<Guide[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedGuide = ref<GuideDetail | null>(null)

  // 전체 가이드 목록 불러오기
  const loadGuides = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await fetchGuides()
      guides.value = data
    } catch (err) {
      error.value = '가이드를 불러오는 중 오류가 발생했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  // 특정 가이드 상세 정보 불러오기
  const loadGuideById = async (guideId: number) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await getGuideById(guideId)
      selectedGuide.value = data
      console.log('Selected Guide:', selectedGuide.value)
      console.log('data:', data)
    } catch (err) {
      error.value = '가이드 상세 정보를 불러오는 중 오류가 발생했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  // 새로운 가이드 생성
  const generateGuide = async (
    petId: number,
    guideType: GuideRequest['guideType'],
    description: string,
  ) => {
    isLoading.value = true
    error.value = null
    try {
      const data: GuideRequest = { guideType, description }
      await createGuide(petId, data)
    } catch (err) {
      error.value = '가이드를 생성하는 중 오류가 발생했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    guides,
    isLoading,
    error,
    selectedGuide,
    loadGuides,
    loadGuideById,
    generateGuide,
  }
})
