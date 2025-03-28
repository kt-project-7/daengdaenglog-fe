import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile, DBTIResult } from '@/types/profile'

export const useProfileStore = defineStore('profile', () => {
  // 프로필 데이터
  const profile = ref<Profile>({
    name: '멍멍이',
    breed: '골든 리트리버',
    age: 3,
    weight: 25.5,
    gender: 'male',
    neutered: true,
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2362&auto=format&fit=crop',
    dbtiResult: {
      type: 'ESTP',
      description:
        '활발하고 사교적인 성격으로, 새로운 경험과 모험을 좋아합니다. 호기심이 많고 에너지가 넘치며, 다른 강아지나 사람들과 어울리는 것을 좋아합니다. 주인의 관심을 끌기 위해 장난을 치기도 하며, 항상 새로운 자극을 찾아다닙니다.',
    },
  })

  // DBTI 분석
  const analyzeDogPersonality = () => {
    const dbtiTypes: DBTIResult[] = [
      {
        type: 'INTJ',
        description:
          '독립적이고 조용한 성격으로, 혼자 있는 시간을 즐기며 주변 환경을 세심하게 관찰합니다. 영리하고 문제 해결 능력이 뛰어나며, 새로운 상황에 적응하기 전에 신중하게 판단합니다.',
      },
      {
        type: 'ENFP',
        description:
          '열정적이고 사교적인 성격으로, 새로운 사람들과 만나는 것을 좋아합니다. 호기심이 많고 창의적이며, 주인의 감정에 민감하게 반응합니다. 항상 주변 사람들의 관심을 끌고 싶어하는 경향이 있습니다.',
      },
      {
        type: 'ISTP',
        description:
          '침착하고 관찰력이 뛰어난 성격으로, 문제 상황에서 실용적인 해결책을 찾는 능력이 있습니다. 독립적이고 자신만의 공간을 중요시하며, 새로운 기술을 배우는 것을 좋아합니다.',
      },
      {
        type: 'ESFJ',
        description:
          '따뜻하고 배려심이 많은 성격으로, 주인과 가족을 보호하고 돌보는 것을 좋아합니다. 사회적 상호작용을 즐기며, 규칙적인 일상과 안정된 환경에서 행복을 느낍니다.',
      },
    ]

    const randomIndex = Math.floor(Math.random() * dbtiTypes.length)
    profile.value.dbtiResult = dbtiTypes[randomIndex]
  }

  // 펫시터 가이드 생성
  const generatePetsitterGuide = () => {
    // API 연동 또는 가이드 생성 로직 구현
    return {
      success: true,
      message: '펫시터 가이드가 성공적으로 생성되었습니다.',
    }
  }

  return {
    profile,
    analyzeDogPersonality,
    generatePetsitterGuide,
  }
})
