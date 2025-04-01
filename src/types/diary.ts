export type Mood =
  | 'HAPPY'
  | 'SAD'
  | 'ANGRY'
  | 'SURPRISED'
  | 'HUNGRY'
  | 'SICK'
  | 'LOVE'
  | 'SLEEPY'

export type Weather =
  | 'SUNNY'
  | 'CLOUDY'
  | 'RAINY'
  | 'SNOWY'
  | 'THUNDER'
  | 'HAILSTONE'
  | 'FOG'
  | 'YELLOW_DUST'

export interface Diary {
  id: string
  date: string
  content: string
  mood: Mood
  weather: Weather
  walkTime?: number
  mealTime?: string
  imageUrl?: string
  memory?: MemoryImage
}

export interface NewDiary {
  date: string
  mood: Mood | ''
  weather: Weather | ''
  content: string
  walkTime: number | null
  mealTime: string
  imageUrl: string | null
}

export interface RawDiary {
  diaryId: number
  createdDate: string
  content: string
  emotionType: string
  weatherType: string
  walkTime?: number
  mealTime?: string
  imageUrl?: string
  memory?: MemoryImage
}

export interface PetDiaryGroup {
  petId: number
  name: string
  imageUri: string
  pbti: string
  petType: string
  diaryList: RawDiary[]
}

export interface MemoryImage {
  content: string
  imageUrl: string
}

export interface TodayDiaryCheck {
  isWrite: boolean
  diaryId: number
}
