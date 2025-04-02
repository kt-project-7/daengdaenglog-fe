import api from './axios'

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
