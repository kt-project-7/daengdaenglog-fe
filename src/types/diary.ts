// 감정 타입 정의 및 리스트
export const EmotionTypes = [
  'HAPPY',
  'SAD',
  'ANGRY',
  'SURPRISED',
  'HUNGRY',
  'SICK',
  'LOVE',
  'SLEEPY',
] as const
export type EmotionType = (typeof EmotionTypes)[number]

// 날씨 타입 정의 및 리스트
export const WeatherTypes = [
  'SUNNY',
  'CLOUDY',
  'RAINY',
  'SNOWY',
  'THUNDER',
  'HAILSTONE',
  'FOG',
  'YELLOW_DUST',
] as const
export type WeatherType = (typeof WeatherTypes)[number]

// 일정(활동) 타입 정의 및 리스트
export const ScheduleTypes = ['WALK', 'FEED'] as const
export type ScheduleType = (typeof ScheduleTypes)[number]

// 일정 데이터 구조
export interface Schedule {
  scheduleId: number
  scheduleType: ScheduleType
  startTime: string
  endTime: string
}

// 다이어리 상세 구조
export interface Diary {
  diaryId: number
  petId: number
  title: string
  content: string
  emotionType: EmotionType
  weatherType: WeatherType
  createdDate: string
  memoryUri: string | null
  generatedImageUri: string | null
  scheduleList: Schedule[]
}

// 다이어리 생성 요청 payload
export interface CreateDiaryRequest {
  petId: number
  title: string
  content: string
  emotionType: EmotionType
  weatherType: WeatherType
  diaryScheduleRequestList: {
    scheduleType: ScheduleType
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
  }[]
}
