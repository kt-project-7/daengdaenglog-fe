<template>
  <section
    class="relative h-screen flex items-center justify-center overflow-hidden p-8 z-30"
  >
    <!-- 크레용 컨테이너 -->
    <div
      class="absolute top-1/2 left-[10%] -translate-y-1/2 z-20 hidden md:block"
    >
      <div
        class="absolute w-5 h-[7.5rem] rounded-md shadow-md bg-_red transform -rotate-15 -translate-x-[30px] z-[3] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[15px] before:bg-_red before:brightness-[0.8] before:rounded-t-md after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-r-[10px] after:border-transparent after:border-b-[15px] after:border-b-white"
      ></div>
      <div
        class="absolute w-5 h-[7.5rem] rounded-md shadow-md bg-blue-400 transform -rotate-5 z-[2] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[15px] before:bg-blue-400 before:brightness-[0.8] before:rounded-t-md after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-r-[10px] after:border-transparent after:border-b-[15px] after:border-b-white"
      ></div>
      <div
        class="absolute w-5 h-[7.5rem] rounded-md shadow-md bg-green-400 transform rotate-5 translate-x-[30px] z-[1] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[15px] before:bg-green-400 before:brightness-[0.8] before:rounded-t-md after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-r-[10px] after:border-transparent after:border-b-[15px] after:border-b-white"
      ></div>
    </div>

    <!-- 스케치북 -->
    <div
      class="flex flex-col md:flex-row max-w-5xl w-full bg-transparent relative z-10"
    >
      <!-- 바인더 부분 -->
      <div
        class="w-full md:w-[1.875rem] h-[1.875rem] md:h-auto bg-[#f59e0b] rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-row md:flex-col justify-around items-center p-0 md:py-5 shadow-md"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="w-[0.9375rem] h-[0.9375rem] bg-white/80 rounded-full mx-[0.3125rem] my-0 md:my-[0.3125rem] md:mx-0 shadow-[inset_0_0_3px_rgba(0,0,0,0.3)]"
        ></div>
      </div>

      <!-- 내용 부분 -->
      <div
        class="flex-1 bg-white rounded-b-lg md:rounded-r-lg md:rounded-bl-none p-8 shadow-md relative bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[length:20px_20px]"
      >
        <h2
          class="text-3xl text-[#f59e0b] text-center mb-8 font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[150px] after:h-[3px] after:bg-[#f59e0b] after:rounded-md"
        >
          다이어리 작성 가이드
        </h2>

        <div class="flex flex-wrap justify-between mb-10">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex flex-col items-center text-center p-4 transition-all duration-300 hover:-translate-y-1 flex-1 min-w-[150px] relative"
          >
            <div
              class="bg-[#f59e0b] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-yellow-600 shadow-md"
            >
              <component :is="step.icon" class="w-[30px] h-[30px] text-white" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#f59e0b] mb-2">
                {{ step.title }}
              </h3>
              <p class="text-sm text-_black/70">{{ step.description }}</p>
            </div>
          </div>
        </div>

        <router-link
          to="/diary-write"
          class="block w-fit mx-auto bg-[#f59e0b] text-white border-[3px] border-yellow-600 py-4 px-8 rounded-full text-lg font-bold transition-all hover:bg-[#f59e0b]/80 hover:-translate-y-1 hover:rotate-1 shadow-md hover:shadow-lg"
        >
          다이어리 작성하기
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CalendarDays, CloudSun, PenLine, ImagePlus } from 'lucide-vue-next'

const steps = [
  {
    icon: CalendarDays,
    title: '날짜 선택',
    description: '기록하고 싶은 날짜를 선택하세요',
  },
  {
    icon: CloudSun,
    title: '항목 설정',
    description: '그날의 날씨와 기분을 기록하세요',
  },
  {
    icon: PenLine,
    title: '일기 작성',
    description: '특별한 순간을 기록하세요',
  },
  {
    icon: ImagePlus,
    title: '사진 추가',
    description: '소중한 추억을 사진과 함께 저장하세요',
  },
]
</script>
