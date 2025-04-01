import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Diary, NewDiary, Mood, Weather } from '@/types/diary'
import {
  fetchAllDiaries,
  getDiary,
  createDiary as createDiaryAPI,
  updateDiary as updateDiaryAPI,
  deleteDiary as deleteDiaryAPI,
  checkTodayDiary,
} from '@/apis/diary'

export const useDiaryStore = defineStore('diary', () => {
  const diaries = ref<Diary[]>([])
  const currentDiary = ref<Diary | null>(null)
  const selectedImageFile = ref<File | null>(null)

  const today = computed(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })

  const getInitialNewDiary = (): NewDiary => ({
    date: today.value,
    mood: '',
    weather: '',
    title: '',
    content: '',
    walkTime: null,
    mealTime: '',
    imageUrl: null,
  })

  const newDiary = ref<NewDiary>(getInitialNewDiary())

  const setImageFile = (file: File | null) => {
    selectedImageFile.value = file
  }

  const createFormData = (diary: NewDiary | Diary) => {
    const formData = new FormData()
    formData.append('date', diary.date)
    formData.append('mood', diary.mood)
    formData.append('weather', diary.weather)
    formData.append('content', diary.content)
    if (diary.walkTime) formData.append('walkTime', diary.walkTime.toString())
    if (diary.mealTime) formData.append('mealTime', diary.mealTime)
    if (selectedImageFile.value) {
      formData.append('image', selectedImageFile.value)
    }
    return formData
  }

  const fetchDiaries = async () => {
    diaries.value = await fetchAllDiaries()
  }

  const fetchDiaryById = async (id: string) => {
    const diary = await getDiary(Number(id))
    currentDiary.value = diary
  }

  const setCurrentDiaryId = async (id: string) => {
    await fetchDiaryById(id)
  }

  const createDiary = async () => {
    try {
      // FormData 객체 생성
      const formData = new FormData()

      // createDiaryRequest 추가 - curl 예제와 정확히 같은 방식
      const createDiaryRequestJson = JSON.stringify({
        petId: 1,
        emotionType: newDiary.value.mood.toUpperCase() || 'SAD',
        weatherType: newDiary.value.weather.toUpperCase() || 'THUNDER',
        title: 'create',
        content: newDiary.value.content || 'string',
        diaryScheduleRequestList: [],
      })

      // -F 'createDiaryRequest={json}' 형식으로 추가
      formData.append('createDiaryRequest', createDiaryRequestJson)

      // -F 'file=' 형식으로 파일 추가
      if (selectedImageFile.value) {
        formData.append('file', selectedImageFile.value)
      } else {
        formData.append('file', '')
      }

      console.log('FormData 생성 완료')

      const result = await createDiaryAPI(formData)
      await fetchDiaries()
      return result
    } catch (error) {
      console.error('createDiary 오류:', error)
      throw error
    }
  }

  const updateDiary = async (diaryId: number) => {
    try {
      // FormData 객체 생성
      const formData = new FormData()

      // JSON 객체 생성
      const updateDiaryRequest = {
        emotionType: newDiary.value.mood.toUpperCase(),
        weatherType: newDiary.value.weather.toUpperCase(),
        title: '수정된 일기',
        content: newDiary.value.content,
        walkTime: newDiary.value.walkTime || 0,
        mealTime: newDiary.value.mealTime || '',
        diaryScheduleRequestList: [],
      }

      console.log('updateDiaryRequest:', updateDiaryRequest)

      // JSON 문자열로 변환하여 FormData에 추가
      formData.append('updateDiaryRequest', JSON.stringify(updateDiaryRequest))

      // 이미지 파일이 있으면 'file' 이름으로 추가
      if (selectedImageFile.value) {
        formData.append('file', selectedImageFile.value)
      }

      console.log('FormData 생성 완료')

      const result = await updateDiaryAPI(diaryId, formData)
      await fetchDiaries()
      return result
    } catch (error) {
      console.error('updateDiary 오류:', error)
      throw error
    }
  }

  const deleteDiary = async (diaryId: number) => {
    await deleteDiaryAPI(diaryId)
    await fetchDiaries()
  }

  const checkAndLoadTodayDiary = async (petId: number) => {
    const { isWrite, diaryId } = await checkTodayDiary(petId)
    if (isWrite && diaryId) {
      const diary = await getDiary(diaryId)
      currentDiary.value = diary

      // newDiary 폼에도 값 채워주기 (수정 모드용)
      newDiary.value = {
        date: diary.date,
        mood: diary.mood as Mood,
        weather: diary.weather as Weather,
        title: diary.title || '',
        content: diary.content,
        walkTime: diary.walkTime ?? null,
        mealTime: diary.mealTime ?? '',
        imageUrl: diary.imageUrl ?? null,
      }
    } else {
      currentDiary.value = null
      newDiary.value = getInitialNewDiary()
    }
  }

  return {
    diaries,
    currentDiary,
    newDiary,
    today,
    selectedImageFile,
    setImageFile,
    setCurrentDiaryId,
    getInitialNewDiary,
    fetchDiaries,
    fetchDiaryById,
    createDiary,
    updateDiary,
    deleteDiary,
    checkAndLoadTodayDiary,
    createFormData,
  }
})
