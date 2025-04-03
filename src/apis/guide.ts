import api from './axios'
import { Guide, GuideDetail, GuideRequest } from '@/types/guide'

export const createGuide = async (petId: number, data: GuideRequest) => {
  try {
    const response = await api.post(`/guide/${petId}`, data)
    return response.data
  } catch (error) {
    console.error('Failed to create guide:', error)
    throw error
  }
}

export const fetchGuides = async (): Promise<Guide[]> => {
  try {
    const response = await api.get(`/guide/`)
    return response.data.results.guideSimpleResponseList
  } catch (error) {
    console.error('Failed to fetch guides:', error)
    throw error
  }
}

export const getGuideById = async (guideId: number): Promise<GuideDetail> => {
  const response = await api.get(`/guide/list/${guideId}`)
  console.log('getGuideById response:', response.data.results)
  return response.data.results
}
