import api from './axios'
import type { Profile } from '@/types/profile'

// 전체 반려동물 목록 가져오기
export const fetchPets = async (): Promise<Profile[]> => {
  const response = await api.get('/pet/')
  return response.data.results.petSimpleInfoResponseList
}
