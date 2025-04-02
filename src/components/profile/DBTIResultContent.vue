<script setup lang="ts">
import type { Profile } from '@/types/profile'
import { Brain } from 'lucide-vue-next'
import { dbtiDetails } from '@/data/dbtiDetails'
import { onMounted, watch } from 'vue'

const props = defineProps<{
  pet: Profile
}>()

// 디버깅을 위한 코드 추가
onMounted(() => {
  console.log('DBTIResultContent - dbtiDetails:', dbtiDetails)
  console.log(
    'DBTIResultContent - Available DBTI keys:',
    Object.keys(dbtiDetails),
  )
  console.log('DBTIResultContent - pet.pbti:', props.pet?.pbti)
})

watch(
  () => props.pet?.pbti,
  (newPbti) => {
    console.log('DBTIResultContent - pet.pbti changed:', newPbti)
    console.log(
      'DBTIResultContent - dbtiDetails[pet.pbti]:',
      dbtiDetails[newPbti || ''],
    )
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-6" v-if="pet?.pbti && dbtiDetails[pet.pbti]">
    <div class="text-center mb-6">
      <div
        class="inline-block p-4 bg-chart-category2 bg-opacity-20 rounded-full mb-4"
      >
        <Brain class="w-12 h-12 text-chart-category2" />
      </div>
      <h3 class="text-2xl font-bold text-chart-category2">{{ pet.pbti }}</h3>
      <p class="text-lg text-_gray-500 mt-2">{{ pet.name }}의 DBTI 결과</p>
    </div>

    <!-- 성격 특징 -->
    <div
      class="bg-chart-category2 bg-opacity-10 rounded-xl p-6 border border-chart-category2 border-opacity-20"
    >
      <h4 class="text-xl font-bold text-chart-category2 mb-4">성격 특징</h4>
      <ul class="list-disc list-inside space-y-1 text-_gray-700 text-lg">
        <li
          v-for="(item, index) in dbtiDetails[pet.pbti]?.성격특징"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 행동 패턴 + 양육 팁 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 행동 패턴 -->
      <div
        class="bg-dang-light rounded-xl p-5 border border-chart-category2 border-opacity-20"
      >
        <h4 class="text-lg font-bold text-chart-category2 mb-2">행동 패턴</h4>
        <ul class="list-disc list-inside space-y-1 text-_gray-700 text-base">
          <li
            v-for="(item, index) in dbtiDetails[pet.pbti]?.행동패턴"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- 양육 팁 -->
      <div
        class="bg-dang-light rounded-xl p-5 border border-chart-category2 border-opacity-20"
      >
        <h4 class="text-lg font-bold text-chart-category2 mb-2">양육 팁</h4>
        <ul class="list-disc list-inside space-y-1 text-_gray-700 text-base">
          <li
            v-for="(item, index) in dbtiDetails[pet.pbti]?.양육팁"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="p-6 text-center" v-else-if="pet?.pbti">
    <div class="text-2xl mb-4">😕</div>
    <h3 class="text-xl font-bold text-dang-primary mb-2">
      DBTI 정보를 찾을 수 없습니다
    </h3>
    <p class="text-gray-600">
      '{{ pet.pbti }}' 유형에 대한 상세 정보가 아직 준비되지 않았습니다.
    </p>
  </div>
  <div class="p-6 text-center" v-else>
    <div class="text-2xl mb-4">🔍</div>
    <h3 class="text-xl font-bold text-dang-primary mb-2">
      DBTI 정보가 없습니다
    </h3>
    <p class="text-gray-600">먼저 DBTI 분석을 실행해주세요.</p>
  </div>
</template>
