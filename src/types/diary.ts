export type Mood = 'happy' | 'sad' | 'energetic' | 'tired' | 'angry' | 'calm'

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy'

export type MemoryType = 'image' | 'letter'

export interface Memory {
  type: MemoryType
  content: string
}

export interface Diary {
  id: string
  date: string
  mood: Mood
  weather: Weather
  content: string
  walkTime: number | null
  mealTime: string
  imageUrl: string | null
  hasMemory: boolean
  memory: Memory | null
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
