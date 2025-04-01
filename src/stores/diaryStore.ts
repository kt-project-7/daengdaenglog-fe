import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Diary, NewDiary } from '@/types/diary'
import {
  fetchAllDiaries,
  getDiary,
  createDiary as createDiaryAPI,
} from '@/apis/diary'

export const useDiaryStore = defineStore('diary', () => {
  // 일기 목록
  const diaries = ref<Diary[]>([])

  // 현재 선택된 일기
  const currentDiary = ref<Diary | null>(null)

  // 오늘 날짜
  const today = computed(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })

  // 새 일기 폼 초기값
  const getInitialNewDiary = (): NewDiary => ({
    date: today.value,
    mood: '',
    weather: '',
    content: '',
    walkTime: null,
    mealTime: '',
    imageUrl: null,
  })

  // 새 일기 폼
  const newDiary = ref<NewDiary>(getInitialNewDiary())

  // 일기 상세 보기
  const setCurrentDiaryId = async (id: string) => {
    const diary = await getDiary(Number(id))
    currentDiary.value = diary
  }

  // 다이어리 전체 조회 API 연결
  const fetchDiaries = async () => {
    diaries.value = await fetchAllDiaries()
  }

  const fetchDiaryById = async (id: string) => {
    const diary = await getDiary(Number(id))
    currentDiary.value = diary
  }

  const createDiary = async (formData: FormData) => {
    const response = await createDiaryAPI(formData)
    return response
  }

  return {
    diaries,
    currentDiary,
    newDiary,
    today,
    setCurrentDiaryId,
    getInitialNewDiary,
    fetchDiaries,
    fetchDiaryById,
    createDiary,
    updateDiary,
    deleteDiary,
  }
})
