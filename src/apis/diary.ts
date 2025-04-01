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
  try {
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
  } catch (error) {
    console.error('전체 다이어리 조회 실패:', error)
    throw error
  }
}

// 새 다이어리 생성
export const createDiary = async (
  formData: FormData,
): Promise<{ diaryId: number }> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('다이어리 생성 API 호출:')

      const baseURL = import.meta.env.VITE_API_BASE_URL || ''
      const token = localStorage.getItem('accessToken')
      const url = `${baseURL}/diary`

      // XMLHttpRequest 사용 - low level API
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)

      // 헤더 설정
      xhr.setRequestHeader('Accept', '*/*')
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)

      // 응답 처리
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('서버 응답:', xhr.responseText)
          const data = JSON.parse(xhr.responseText)
          resolve(data.results)
        } else {
          console.error(
            '서버 오류 응답:',
            xhr.status,
            xhr.statusText,
            xhr.responseText,
          )
          reject(new Error(`HTTP error! status: ${xhr.status}`))
        }
      }

      // 에러 처리
      xhr.onerror = function () {
        console.error('네트워크 오류')
        reject(new Error('Network error'))
      }

      // 전송
      xhr.send(formData)
    } catch (error) {
      console.error('다이어리 생성 실패:', error)
      reject(error)
    }
  })
}

// 다이어리 수정
export const updateDiary = async (
  diaryId: number,
  formData: FormData,
): Promise<{ diaryId: number }> => {
  try {
    console.log('API 호출 정보:')
    console.log('diaryId:', diaryId)

    // FormData 내용 확인
    console.log(
      'updateDiaryRequest 포함 여부:',
      formData.has('updateDiaryRequest'),
    )
    console.log('file 포함 여부:', formData.has('file'))

    const response = await api.put(`/diary/${diaryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('서버 응답:', response.data)
    return response.data.results
  } catch (error: any) {
    console.error('다이어리 수정 실패:', error)
    if (error.response) {
      console.error('에러 응답:', error.response.data)
    }
    throw error
  }
}

// 다이어리 삭제
export const deleteDiary = async (diaryId: number): Promise<void> => {
  try {
    const response = await api.delete(`/diary/${diaryId}`)
    return response.data.results
  } catch (error) {
    console.error('다이어리 삭제 실패:', error)
    throw error
  }
}

// 다이어리 상세조회
export const getDiary = async (diaryId: number): Promise<Diary> => {
  try {
    const response = await api.get(`/diary/${diaryId}`)
    return response.data.results
  } catch (error) {
    console.error('다이어리 상세조회 실패:', error)
    throw error
  }
}

// 추억 그림 생성
export const createDiaryMemoryImage = async (
  diaryId: number,
  formData: FormData,
): Promise<MemoryImage> => {
  try {
    const response = await api.post(`/diary/${diaryId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.results
  } catch (error) {
    console.error('추억 그림 생성 실패:', error)
    throw error
  }
}

// 오늘 다이어리 작성 여부 확인
export const checkTodayDiary = async (
  petId: number,
): Promise<TodayDiaryCheck> => {
  try {
    const response = await api.get(`/diary/today?petId=${petId}`)
    return response.data.results
  } catch (error) {
    console.error('오늘 다이어리 작성 여부 확인 실패:', error)
    throw error
  }
}
