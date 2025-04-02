import api from './axios'
import type { Claim } from '@/types/claim'

interface PetInsuranceItem {
  id: number | null
  date: string
  hospitalName: string
  description: string
  medicalFee: number
  claimAmount: number
  refundAmount: number
  ProgressType: string
}

// 서버에서 데이터 가져오기
export const loadClaims = async (): Promise<Claim[]> => {
  try {
    const response = await api.get(`/pet/insurance/1`) // API 엔드포인트 수정 필요
    return response.data.results.petInsuranceList.map(
      (item: PetInsuranceItem) => ({
        id: item.id || null,
        date: item.date,
        hospital: item.hospitalName,
        description: item.description,
        medicalFee: item.medicalFee,
        claimAmount: item.claimAmount,
        refundAmount: item.refundAmount,
        status: item.ProgressType.toLowerCase(),
      }),
    )
  } catch (error) {
    console.error('Failed to fetch claims:', error)
    return [] // Return an empty array in case of an error
  }
}
