export type Mood =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'hungry'
  | 'hurt'
  | 'love'
  | 'sleepy'

export type Weather =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'thunderstorm'
  | 'hail'
  | 'foggy'
  | 'yellowdust'

export interface Diary {
  id: string
  date: string
  content: string
  mood: string
  weather: string
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

export interface MemoryImage {
  content: string
  imageUrl: string
}

export interface TodayDiaryCheck {
  isWrite: boolean
  diaryId: number
}
