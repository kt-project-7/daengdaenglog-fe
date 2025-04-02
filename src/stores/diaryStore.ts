import { defineStore } from 'pinia'
import {
  fetchAllDiaries,
  fetchDiaryDetail,
  createDiary,
  updateDiary,
  deleteDiary,
  generateDiaryImage,
} from '@/apis/diary'
import type { Diary, CreateDiaryRequest } from '@/types/diary'

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    diaries: [] as Diary[],
    selectedDiary: null as Diary | null,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async loadDiaries() {
      this.isLoading = true
      try {
        const diaryGroups = await fetchAllDiaries()
        const flat = diaryGroups.flatMap((pet: any) => pet.diaryList)
        this.diaries = flat.sort((a: any, b: any) =>
          b.createdDate.localeCompare(a.createdDate),
        )
      } catch (e) {
        this.error = '다이어리를 불러오는데 실패했습니다.'
      } finally {
        this.isLoading = false
      }
    },

    async loadDiaryDetail(diaryId: number) {
      this.isLoading = true
      try {
        const diary = await fetchDiaryDetail(diaryId)
        this.selectedDiary = diary
      } catch (e) {
        this.error = '다이어리 상세 정보를 불러오지 못했습니다.'
      } finally {
        this.isLoading = false
      }
    },

    async addDiary(payload: CreateDiaryRequest, file?: File) {
      try {
        const newDiaryId = await createDiary(payload, file)
        await this.loadDiaries()
        return newDiaryId
      } catch (e) {
        this.error = '다이어리를 저장하는 데 실패했습니다.'
      }
    },

    async editDiary(diaryId: number, payload: CreateDiaryRequest, file?: File) {
      try {
        await updateDiary(diaryId, payload, file)
        await this.loadDiaries()
      } catch (e) {
        this.error = '다이어리를 수정하는 데 실패했습니다.'
      }
    },

    async removeDiary(diaryId: number) {
      try {
        await deleteDiary(diaryId)
        this.diaries = this.diaries.filter((d) => d.diaryId !== diaryId)
      } catch (e) {
        this.error = '다이어리를 삭제하지 못했습니다.'
      }
    },

    async generateImage(diaryId: number) {
      try {
        const imageUrl = await generateDiaryImage(diaryId)

        // diaries 배열에서 해당 일기 업데이트
        const target = this.diaries.find((d) => d.diaryId === diaryId)
        if (target) {
          target.memoryUri = imageUrl
        }

        // selectedDiary가 있고 현재 보고 있는 일기와 같은 id인 경우 업데이트
        if (this.selectedDiary && this.selectedDiary.diaryId === diaryId) {
          // 새 객체를 만들어 할당하여 반응형 트리거
          this.selectedDiary = {
            ...this.selectedDiary,
            memoryUri: imageUrl,
          }
        }

        return imageUrl
      } catch (e) {
        this.error = '이미지 생성에 실패했습니다.'
        throw e
      }
    },

    clearSelected() {
      this.selectedDiary = null
    },
  },
})
