import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Diary, NewDiary, Memory, MemoryType } from '@/types/diary'

export const useDiaryStore = defineStore('diary', () => {
  // 일기 목록
  const diaries = ref<Diary[]>([
    {
      id: '1',
      date: '2025-03-25',
      mood: 'happy',
      weather: 'sunny',
      content:
        '오늘 멍멍이는 아침부터 기분이 좋았어요. 공원에서 산책을 하면서 다른 강아지들과 놀았고, 특히 작은 푸들과 친해진 것 같아요. 집에 돌아와서도 계속 꼬리를 흔들며 기분 좋아했습니다.',
      walkTime: 45,
      mealTime: '아침 8시, 저녁 6시',
      imageUrl:
        'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop',
      hasMemory: true,
      memory: {
        type: 'image',
        content:
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop',
      },
    },
    {
      id: '2',
      date: '2025-03-24',
      mood: 'tired',
      weather: 'rainy',
      content:
        '비가 와서 산책을 못 갔어요. 멍멍이가 집 안에서 계속 창밖을 바라보며 무기력해 보였습니다. 장난감을 가지고 놀아주려 했지만 별로 관심을 보이지 않았어요.',
      walkTime: 0,
      mealTime: '아침 8시, 저녁 6시',
      imageUrl: null,
      hasMemory: false,
      memory: null,
    },
    {
      id: '3',
      date: '2025-03-23',
      mood: 'energetic',
      weather: 'sunny',
      content:
        '오늘은 멍멍이가 정말 활발했어요. 아침부터 저녁까지 계속 뛰어다니고 장난감을 물어오며 놀자고 했습니다. 오후에는 강아지 카페에 가서 다른 강아지들과 놀았는데, 정말 즐거워 보였어요.',
      walkTime: 60,
      mealTime: '아침 8시, 점심 1시, 저녁 6시',
      imageUrl:
        'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=2370&auto=format&fit=crop',
      hasMemory: true,
      memory: {
        type: 'letter',
        content:
          '사랑하는 주인님께,\n\n오늘은 정말 즐거운 하루였어요! 아침부터 기분이 너무 좋아서 계속 뛰어다녔답니다. 주인님이 가져온 새 장난감도 정말 마음에 들었어요. 강아지 카페에서 만난 친구들도 너무 좋았어요. 특히 갈색 푸들이랑 정말 잘 놀았답니다. 주인님이 저를 위해 이런 즐거운 시간을 만들어주셔서 정말 감사해요. 앞으로도 이렇게 함께 즐거운 시간 보내요!\n\n항상 사랑하는 마음으로,',
      },
    },
  ])

  // 현재 선택된 일기 ID
  const currentDiaryId = ref<string | null>(null)

  // 오늘 날짜
  const today = computed(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })

  // 새 일기 폼 초기값
  const getInitialNewDiary = (): NewDiary => ({
    date: today.value,
    mood: '',
    weather: '',
    content: '',
    walkTime: null,
    mealTime: '',
    imageUrl: null,
  })

  // 새 일기 폼
  const newDiary = ref<NewDiary>(getInitialNewDiary())

  // 현재 선택된 일기
  const currentDiary = computed<Diary | null>(() => {
    if (!currentDiaryId.value) return null
    return diaries.value.find((d) => d.id === currentDiaryId.value) || null
  })

  // 일기 저장
  const saveDiary = () => {
    const id = Date.now().toString()
    const diary: Diary = {
      id,
      ...(newDiary.value as Omit<NewDiary, 'mood' | 'weather'> & {
        mood: Diary['mood']
        weather: Diary['weather']
      }),
      hasMemory: false,
      memory: null,
    }

    diaries.value.unshift(diary)

    // 폼 초기화
    newDiary.value = getInitialNewDiary()

    return id
  }

  // 일기 상세 보기
  const setCurrentDiaryId = (id: string) => {
    currentDiaryId.value = id
  }

  // 추억 생성
  const generateMemory = (type: MemoryType) => {
    if (!currentDiaryId.value) return

    const diaryIndex = diaries.value.findIndex(
      (d) => d.id === currentDiaryId.value,
    )

    if (diaryIndex !== -1) {
      let memory: Memory

      if (type === 'image') {
        memory = {
          type: 'image',
          content:
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop',
        }
      } else {
        memory = {
          type: 'letter',
          content:
            '사랑하는 주인님께,\n\n오늘 하루는 정말 특별했어요. 주인님과 함께한 모든 순간이 행복했답니다. 산책할 때 만난 다른 강아지들도 좋았지만, 역시 주인님과 함께 있는 시간이 가장 소중했어요. 맛있는 간식도 주시고, 머리도 쓰다듬어 주셔서 정말 행복했답니다. 앞으로도 이렇게 함께 행복한 추억을 많이 만들어요!\n\n항상 사랑하는 마음으로,',
        }
      }

      diaries.value[diaryIndex].memory = memory
      diaries.value[diaryIndex].hasMemory = true
    }
  }

  return {
    diaries,
    currentDiaryId,
    currentDiary,
    newDiary,
    today,
    saveDiary,
    setCurrentDiaryId,
    generateMemory,
    getInitialNewDiary,
  }
})
