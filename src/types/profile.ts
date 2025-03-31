export type Gender = 'male' | 'female'

export interface Profile {
  id: number
  name: string
  breed: string
  age: number
  weight: number
  gender: Gender
  neutered: boolean
  imageUrl: string | null
  dbtiResult: {
    type: string
    description: string
  } | null
  petsitterGuide: {
    meals: {
      frequency: string
      amount: string
      schedule: string
      preferences: string
      restrictions: string
    }
    walks: {
      frequency: string
      duration: string
      bestTime: string
      preferences: string
    }
    specialNotes: string[]
    emergencyTips: string[]
  } | null
}
