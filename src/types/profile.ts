export type Gender = 'male' | 'female'

export interface Profile {
  id: number
  name: string
  petType: string
  breed: string
  age: number
  weight: number
  gender: Gender
  neutered: boolean
  imageUrl: string | null
  pbti: string | null
  petsitterGuide: string | null
}
