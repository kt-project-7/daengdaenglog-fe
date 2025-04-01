import api from './axios'
import type { MemoryImage, Diary, TodayDiaryCheck } from '@/types/diary'

// 전체 다이어리 리스트 조회
export const fetchAllDiaries = async (): Promise<Diary[]> => {
  const response = await api.get('/diary')
  return response.data.results.diaryList.flatMap((pet: any) => {
    return pet.diaryList.map((diary: any) => ({
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

// 새 다이어리 생성
export const createDiary = async (
  formData: FormData,
): Promise<{ diaryId: number }> => {
  const response = await api.post('/diary', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.results
}

// 다이어리 수정
export const updateDiary = async (
  diaryId: number,
  formData: FormData,
): Promise<{ diaryId: number }> => {
  const response = await api.put(`/diary/${diaryId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.results
}

// 다이어리 삭제
export const deleteDiary = async (diaryId: number): Promise<void> => {
  const response = await api.delete(`/diary/${diaryId}`)
  return response.data.results
}

// 다이어리 상세조회
export const getDiary = async (diaryId: number): Promise<Diary> => {
  const response = await api.get(`/diary/${diaryId}`)
  return response.data.results
}

// 추억 그림 생성
export const createDiaryMemoryImage = async (
  diaryId: number,
  formData: FormData,
): Promise<MemoryImage> => {
  const response = await api.post(`/diary/${diaryId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.results
}

// 오늘 다이어리 작성 여부 확인
export const checkTodayDiary = async (
  petId: number,
): Promise<TodayDiaryCheck> => {
  const response = await api.get(`/diary/today?petId=${petId}`)
  return response.data.results
}
