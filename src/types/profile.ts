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
    generalInfo: string
    routineInfo: string
    feedingInfo: string
    healthInfo: string
    specialNotes: string[]
    emergencyTips: string[]
  } | null
}
