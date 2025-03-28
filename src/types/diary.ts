export type Mood = 'happy' | 'sad' | 'angry' | 'surprised' | 'hungry' | 'hurt' | 'love' | 'sleepy'

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm' | 'hail' | 'foggy' | 'yellowdust'

export type MemoryType = 'image' | 'letter'

export interface ImageMemory {
  content: string
}

export interface LetterMemory {
  content: string
}

export interface Memory {
  image?: ImageMemory
  letter?: LetterMemory
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
