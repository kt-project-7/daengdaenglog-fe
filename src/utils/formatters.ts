import type { Mood, Weather } from '@/types/diary'

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
export const getMoodEmoji = (mood: Mood): string => {
  const moodMap: Record<Mood, string> = {
    happy: '😊 기쁨',
    sad: '😢 슬픔',
    angry: '😡 분노',
    surprised: '😲 놀람',
    hungry: '🍴 배고픔',
    hurt: '🤕 상처',
    love: '💖 사랑',
    sleepy: '😴 졸림',
  }

  return moodMap[mood] || mood
}

/**
 * 날씨에 해당하는 이모지와 텍스트 반환
 * @param weather 날씨 타입
 * @returns 이모지와 텍스트 조합 문자열
 */
export const getWeatherEmoji = (weather: Weather): string => {
  const weatherMap: Record<Weather, string> = {
    sunny: '☀️ 맑음',
    cloudy: '☁️ 흐림',
    rainy: '🌧️ 비',
    snowy: '❄️ 눈',
    thunderstorm: '⚡️ 번개',
    hail: '🌨️ 우박',
    foggy: '🌫️ 안개',
    yellowdust: '💨 황사',
  }

  return weatherMap[weather] || weather
}
