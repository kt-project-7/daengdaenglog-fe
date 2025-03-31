export type Gender = 'male' | 'female'

export interface Profile {
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
}
