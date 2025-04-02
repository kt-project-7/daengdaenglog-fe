import api from './axios'
import type { Profile } from '@/types/profile'

export const fetchDbtiResult = async (
  petId: number,
): Promise<{
  results: Profile['pbti']
}> => {
  const response = await api.get(`/pet/pbti/${petId}`)
  return response.data
}
