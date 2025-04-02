import type { EmotionType, WeatherType } from '@/types/diary'

/**
 * 날짜 포맷팅
 * @param dateString ISO 형식 날짜 문자열
 * @returns 한글로 포맷팅된 날짜 문자열 (예: 2023년 3월 25일 (토))
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

/**
 * 기분에 해당하는 이모지와 텍스트 반환
 * @param mood 기분 타입
 * @returns 이모지와 텍스트 조합 문자열
 */
export const getMoodEmoji = (mood: EmotionType): string => {
  const moodMap: Record<EmotionType, string> = {
    HAPPY: '😊 기쁨',
    SAD: '😢 슬픔',
    ANGRY: '😡 분노',
    SURPRISED: '😲 놀람',
    HUNGRY: '🍴 배고픔',
    SICK: '🤕 아픔',
    LOVE: '💖 사랑',
    SLEEPY: '😴 졸림',
  }

  return moodMap[mood] || mood
}

/**
 * 날씨에 해당하는 이모지와 텍스트 반환
 * @param weather 날씨 타입
 * @returns 이모지와 텍스트 조합 문자열
 */
export const getWeatherEmoji = (weather: WeatherType): string => {
  const weatherMap: Record<WeatherType, string> = {
    SUNNY: '☀️ 맑음',
    CLOUDY: '☁️ 흐림',
    RAINY: '🌧️ 비',
    SNOWY: '❄️ 눈',
    THUNDER: '⚡️ 번개',
    HAILSTONE: '🌨️ 우박',
    FOG: '🌫️ 안개',
    YELLOW_DUST: '💨 황사',
  }

  return weatherMap[weather] || weather
}
