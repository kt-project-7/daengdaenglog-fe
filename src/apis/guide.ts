import api from './axios'

export interface Guide {
  guideId: number
  petName: string
  status: string
  guideType: string // '기본', '펫시터', '수의사', '유치원'
  createdDate: string
}

export interface GuideDetail {
  guideId: number
  guideType: string
  createdDate: string
  content?: string
  petName: string
}

export interface GuideRequest {
  guideType: 'HOSPITAL' | 'SITTER' | 'KINDERGARTEN' | 'NONE'
  description: string
}

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

export const getGuideById = async (guideId: number) => {
  const response = await api.get(`/guide/list/${guideId}`)
  console.log('getGuideById response:', response.data.results)
  return response.data.results
}
