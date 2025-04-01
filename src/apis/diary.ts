import api from './axios'
import type {
  MemoryImage,
  Diary,
  TodayDiaryCheck,
  PetDiaryGroup,
  RawDiary,
} from '@/types/diary'

// 전체 다이어리 리스트 조회
export const fetchAllDiaries = async (): Promise<Diary[]> => {
  const response = await api.get('/diary')
  return response.data.results.diaryList.flatMap((pet: PetDiaryGroup) => {
    return pet.diaryList.map((diary: RawDiary) => ({
      id: diary.diaryId.toString(),
      date: diary.createdDate,
      content: diary.content,
      mood: diary.mood?.toLowerCase() || '',
      weather: diary.weather?.toLowerCase() || '',
      walkTime: diary.walkTime,
      mealTime: diary.mealTime,
      imageUrl: diary.imageUrl,
      memory: diary.memory,
    }))
  })
}

// 다이어리 상세조회
export const getDiary = async (diaryId: number): Promise<Diary> => {
  const response = await api.get(`/diary/${diaryId}`)
  return response.data.results
}

// 다이어리 생성
export const createDiary = async (formData: FormData) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  const url = `${baseURL}/diary`
  const token = localStorage.getItem('accessToken')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type 설정 ❌ (자동으로 설정됨)
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('생성 실패:', errorData)
    throw new Error(`HTTP error ${response.status}: ${errorData.detail}`)
  }

  return await response.json()
}

// 다이어리 수정
export const updateDiary = async (diaryId: number, formData: FormData) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  const url = `${baseURL}/diary/${diaryId}`
  const token = localStorage.getItem('accessToken')

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type은 자동 설정 (절대 넣지 마!)
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('서버 오류 응답:', response.status, errorData)
    throw new Error(`HTTP error ${response.status}: ${errorData.detail}`)
  }

  const data = await response.json()
  console.log('서버 응답:', data)
  return data.results || { diaryId }
}

// 다이어리 삭제
export const deleteDiary = async (diaryId: number): Promise<void> => {
  const response = await api.delete(`/diary/${diaryId}`)
  return response.data.results
}

// 오늘 다이어리 작성 여부 확인
export const checkTodayDiary = async (
  petId: number,
): Promise<TodayDiaryCheck> => {
  const response = await api.get(`/diary/today?petId=${petId}`)
  return response.data.results
}

// 추억 그림 생성
export const createDiaryMemoryImage = async (
  diaryId: number,
  formData: FormData,
): Promise<MemoryImage> => {
  const response = await api.post(`/diary/${diaryId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.results
}
