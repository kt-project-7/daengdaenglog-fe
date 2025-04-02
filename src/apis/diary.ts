import api from './axios'
import { Diary, CreateDiaryRequest } from '@/types/diary'

// 1. 전체 다이어리 목록 조회 (GET /diary)
export const fetchAllDiaries = async (): Promise<any> => {
  const res = await api.get('/diary')
  return res.data.results.diaryList
}

// 2. 단일 다이어리 조회 (GET /diary/{diaryId})
export const fetchDiaryDetail = async (diaryId: number): Promise<Diary> => {
  const res = await api.get(`/diary/${diaryId}`)
  return res.data.results
}

// 3. 다이어리 생성 (POST /diary)
export const createDiary = async (
  data: CreateDiaryRequest,
  file?: File,
): Promise<void> => {
  const formData = new FormData()

  formData.append('createDiaryRequest', JSON.stringify(data))

  if (file) {
    formData.append('file', file)
  }

  await api.post('/diary', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 4. 다이어리 수정 (PUT /diary/{diaryId})
export const updateDiary = async (
  diaryId: number,
  data: CreateDiaryRequest,
  file?: File,
): Promise<void> => {
  const formData = new FormData()

  formData.append('updateDiaryRequest', JSON.stringify(data))

  if (file) {
    formData.append('file', file)
  }

  try {
    await api.put(`/diary/${diaryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('다이어리 수정 실패:', error)
    throw error
  }
}

// 5. 다이어리 삭제 (DELETE /diary/{diaryId})
export const deleteDiary = async (diaryId: number): Promise<void> => {
  await api.delete(`/diary/${diaryId}`)
}

// 6. 추억 그림 생성 (GET /diary/{diaryId}/image)
export const generateDiaryImage = async (diaryId: number): Promise<string> => {
  const res = await api.get(`/diary/${diaryId}/image`)
  return res.data.results.memoryUri || res.data.results.generatedImageUri
}
