export type Gender = 'male' | 'female'

export interface DBTIResult {
  type: string
  description: string
}

export interface Profile {
  name: string
  breed: string
  age: number
  weight: number
  gender: Gender
  neutered: boolean
  imageUrl: string | null
  dbtiResult: DBTIResult | null
}
