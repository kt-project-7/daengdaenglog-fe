import { defineStore } from 'pinia'
import { createGuide, GuideRequest } from '@/apis/guide'

export const useGuideStore = defineStore('guide', {
  state: () => ({
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async generateGuide(
      petId: number,
      guideType: GuideRequest['guideType'],
      description: string,
    ) {
      this.isLoading = true
      this.error = null

      try {
        const data: GuideRequest = { guideType, description }
        await createGuide(petId, data)
      } catch (error: any) {
        this.error = error.message || 'Failed to generate guide'
      } finally {
        this.isLoading = false
      }
    },
  },
})
