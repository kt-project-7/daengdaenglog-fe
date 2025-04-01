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
  const selectedPetId = ref<number>(1)
  const selectedDiaryId = ref<number>(0)

  const today = computed(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })

  const getInitialNewDiary = (): NewDiary => ({
    date: today.value,
    mood: '',
    weather: '',
    content: '',
    walkTime: null,
    mealTime: '',
    imageUrl: null,
  })

  const newDiary = ref<NewDiary>(getInitialNewDiary())

  const setImageFile = (file: File | null) => {
    selectedImageFile.value = file
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
      petId: selectedPetId.value,
      emotionType: newDiary.value.mood.toUpperCase(),
      weatherType: newDiary.value.weather.toUpperCase(),
      title: 'create',
      content: newDiary.value.content,
      diaryScheduleRequestList: [],
    }

    const formData = new FormData()
    formData.append(
      'createDiaryRequest',
      new Blob([JSON.stringify(createDiaryRequest)], {
        type: 'application/json',
      }),
    )

    if (selectedImageFile.value) {
      formData.append('file', selectedImageFile.value)
    } else {
      formData.append('file', new Blob())
    }

    await createDiaryAPI(formData)
    await fetchDiaries()
  }

  const updateDiary = async (diaryId: number) => {
    const updateDiaryRequest = {
      petId: selectedPetId.value,
      emotionType: newDiary.value.mood.toUpperCase(),
      weatherType: newDiary.value.weather.toUpperCase(),
      title: '수정된 일기',
      content: newDiary.value.content,
      walkTime: newDiary.value.walkTime || 0,
      mealTime: newDiary.value.mealTime || '',
      diaryScheduleRequestList: [],
    }

    const formData = new FormData()
    formData.append(
      'updateDiaryRequest',
      new Blob([JSON.stringify(updateDiaryRequest)], {
        type: 'application/json',
      }),
    )

    if (selectedImageFile.value) {
      formData.append('file', selectedImageFile.value)
    } else {
      formData.append('file', new Blob())
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
    selectedPetId,
  }
})
