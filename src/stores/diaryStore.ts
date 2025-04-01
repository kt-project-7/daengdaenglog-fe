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
    // title: '',
    content: '',
    walkTime: null,
    mealTime: '',
    imageUrl: null,
  })

  const newDiary = ref<NewDiary>(getInitialNewDiary())

  const setImageFile = (file: File | null) => {
    selectedImageFile.value = file
  }

  const createFormDataFromNewDiary = (): FormData => {
    const request = {
      petId: 1,
      emotionType: newDiary.value.mood.toUpperCase(),
      weatherType: newDiary.value.weather.toUpperCase(),
      // title: '수정된 일기',
      content: newDiary.value.content,
      walkTime: newDiary.value.walkTime || 0,
      mealTime: newDiary.value.mealTime || '',
      diaryScheduleRequestList: [],
    }

    const formData = new FormData()
    formData.append('updateDiaryRequest', JSON.stringify(request))
    if (selectedImageFile.value) {
      formData.append('file', selectedImageFile.value)
    }
    return formData
  }

  const createFormDataFromNewDiaryForCreate = (): FormData => {
    const request = {
      petId: 1,
      emotionType: newDiary.value.mood.toUpperCase() || 'SAD',
      weatherType: newDiary.value.weather.toUpperCase() || 'THUNDER',
      title: 'create',
      content: newDiary.value.content || 'string',
      diaryScheduleRequestList: [],
    }

    const formData = new FormData()
    formData.append('createDiaryRequest', JSON.stringify(request))
    if (selectedImageFile.value) {
      formData.append('file', selectedImageFile.value)
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
    const createDiaryRequest = {
      petId: 1,
      emotionType: newDiary.value.mood.toUpperCase(),
      weatherType: newDiary.value.weather.toUpperCase(),
      title: 'create',
      content: newDiary.value.content,
      diaryScheduleRequestList: [],
    }

    const formData = new FormData()
    formData.append('createDiaryRequest', JSON.stringify(createDiaryRequest))

    if (selectedImageFile.value) {
      formData.append('file', selectedImageFile.value)
    } else {
      // 서버에서 file 필드를 요구하는 경우 빈값도 보내줘야 함
      formData.append('file', new Blob())
    }

    await createDiaryAPI(formData)
  }

  const updateDiary = async (diaryId: number) => {
    const updateDiaryRequest = {
      emotionType: newDiary.value.mood.toUpperCase(),
      weatherType: newDiary.value.weather.toUpperCase(),
      title: '수정된 일기',
      content: newDiary.value.content,
      walkTime: newDiary.value.walkTime || 0,
      mealTime: newDiary.value.mealTime || '',
      diaryScheduleRequestList: [],
    }

    const formData = new FormData()
    formData.append('updateDiaryRequest', JSON.stringify(updateDiaryRequest))

    if (selectedImageFile.value) {
      formData.append('file', selectedImageFile.value)
    } else {
      formData.append('file', '') // 선택 안 했을 때도 key는 있어야 함
    }

    return await updateDiaryAPI(diaryId, formData)
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

      newDiary.value = {
        date: diary.date,
        mood: diary.mood as Mood,
        weather: diary.weather as Weather,
        // title: diary.title || '',
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
  }
})
