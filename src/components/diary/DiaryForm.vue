<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { Camera, X, Plus } from 'lucide-vue-next'

const diaryStore = useDiaryStore()

// defineEmits는 한 번만 선언
const emit = defineEmits(['submit', 'cancel'])

// 이미지 업로드 관련
const imageInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(diaryStore.newDiary.imageUrl ?? null)
let selectedImageFile: File | null = null

// 활동 관련 (산책/식사)
interface Activity {
  type: 'walk' | 'meal'
  startTime: string
  endTime: string
}

const activities = ref<Activity[]>([
  { type: 'walk', startTime: '', endTime: '' },
])

// 새 활동 추가
const addActivity = () => {
  activities.value.push({ type: 'walk', startTime: '', endTime: '' })
}

// 활동 제거
const removeActivity = (index: number) => {
  activities.value.splice(index, 1)
}

// 이미지 선택 처리
const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target) {
        imagePreview.value = e.target.result as string
        diaryStore.newDiary.imageUrl = e.target.result as string
        diaryStore.setImageFile(file)
        console.log('이미지 선택됨:', file.name)
      }
    }

    reader.readAsDataURL(file)
  }
}

// 이미지 제거
const removeImage = () => {
  imagePreview.value = null
  diaryStore.newDiary.imageUrl = null
  diaryStore.setImageFile(null)
  if (imageInput.value) {
    imageInput.value.value = ''
  }
  console.log('이미지 제거됨')
}

// 이미지 선택 창 열기
const openImageSelector = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// 폼 제출 전 활동 데이터 처리
const handleSubmit = () => {
  // 활동 데이터를 diaryStore에 저장
  const walkTimes: string[] = []
  const mealTimes: string[] = []

  activities.value.forEach((activity) => {
    const timeString = `${activity.startTime} ~ ${activity.endTime}`
    if (activity.type === 'walk') {
      walkTimes.push(timeString)
    } else {
      mealTimes.push(timeString)
    }
  })

  diaryStore.newDiary.walkTime = walkTimes.join(', ')
  diaryStore.newDiary.mealTime = mealTimes.join(', ')

  // 폼 제출 이벤트 발생
  emit('submit')
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-dang-background rounded-xl shadow-dang-md p-8 border border-dang-light"
  >
    <!-- 제목 필드 추가 -->
    <div class="mb-5">
      <label class="block text-dang-primary font-medium mb-2">제목</label>
      <input
        type="text"
        v-model="diaryStore.newDiary.title"
        class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
        placeholder="일기 제목을 입력하세요"
        required
      />
    </div>

    <div class="mb-5">
      <label class="block text-dang-primary font-medium mb-2">날짜</label>
      <input
        type="date"
        v-model="diaryStore.newDiary.date"
        class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
        :max="diaryStore.today"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <div>
        <label class="block text-dang-primary font-medium mb-2"
          >댕댕이 기분</label
        >
        <select
          v-model="diaryStore.newDiary.mood"
          class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
          required
        >
          <option value="" disabled>기분을 선택하세요</option>
          <option value="happy">😊 행복</option>
          <option value="sad">😢 슬픔</option>
          <option value="angry">😠 화남</option>
          <option value="surprised">😲 놀람</option>
          <option value="hungry">🍴 배고픔</option>
          <option value="hurt">🤕 상처</option>
          <option value="love">💖 사랑</option>
          <option value="sleepy">😴 졸림</option>
        </select>
      </div>

      <div>
        <label class="block text-dang-primary font-medium mb-2">날씨</label>
        <select
          v-model="diaryStore.newDiary.weather"
          class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
          required
        >
          <option value="" disabled>날씨를 선택하세요</option>
          <option value="sunny">☀️ 맑음</option>
          <option value="cloudy">☁️ 흐림</option>
          <option value="rainy">🌧️ 비</option>
          <option value="snowy">❄️ 눈</option>
          <option value="thunderstorm">⚡️ 번개</option>
          <option value="hail">🌨️ 우박</option>
          <option value="foggy">🌫️ 안개</option>
          <option value="yellowdust">💨 황사</option>
        </select>
      </div>
    </div>

    <!-- 산책/식사 시간 필드 수정 -->
    <div class="mb-5">
      <div class="flex justify-between items-center mb-2">
        <label class="block text-dang-primary font-medium">오늘의 활동</label>
        <button
          type="button"
          @click="addActivity"
          class="flex items-center text-dang-primary hover:text-dang-secondary transition-colors"
        >
          <Plus class="w-5 h-5 mr-1" />
          <span>활동 추가</span>
        </button>
      </div>

      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="flex items-center gap-3 mb-3 p-3 border border-dang-light rounded-md bg-white"
      >
        <div class="flex-shrink-0">
          <select
            v-model="activity.type"
            class="px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
          >
            <option value="walk">산책</option>
            <option value="meal">식사</option>
          </select>
        </div>

        <div class="flex-grow grid grid-cols-2 gap-2">
          <input
            type="time"
            v-model="activity.startTime"
            class="px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
            placeholder="시작 시간"
          />
          <input
            type="time"
            v-model="activity.endTime"
            class="px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
            placeholder="종료 시간"
          />
        </div>

        <button
          v-if="activities.length > 1"
          type="button"
          @click="removeActivity(index)"
          class="flex-shrink-0 text-dang-rejected hover:text-opacity-80 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="mb-5">
      <label class="block text-dang-primary font-medium mb-2">관찰 내용</label>
      <textarea
        v-model="diaryStore.newDiary.content"
        rows="5"
        class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
        placeholder="오늘 댕댕이는 어땠나요? 특별한 행동이나 변화가 있었나요?"
        required
      ></textarea>
    </div>

    <div class="mb-6">
      <label class="block text-dang-primary font-medium mb-2"
        >일기 이미지</label
      >
      <div
        class="relative border-2 border-dashed border-dang-light rounded-lg p-4 text-center hover:border-dang-primary transition-colors"
        :class="{ 'bg-dang-light bg-opacity-20': !imagePreview }"
      >
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageSelect"
        />

        <div v-if="!imagePreview" class="py-8">
          <Camera class="w-12 h-12 mx-auto text-dang-secondary mb-3" />
          <p class="text-dang-secondary mb-2">이미지를 업로드해주세요</p>
          <p class="text-dang-secondary text-sm mb-4">
            JPG, PNG 파일 (최대 5MB)
          </p>
          <button
            type="button"
            @click="openImageSelector"
            class="px-4 py-2 bg-dang-primary text-white rounded-md hover:bg-dang-secondary transition-colors shadow-dang-sm"
          >
            이미지 선택하기
          </button>
        </div>

        <div v-else class="relative">
          <img
            :src="imagePreview"
            alt="선택한 이미지"
            class="max-h-64 mx-auto rounded-md"
          />
          <button
            type="button"
            @click="removeImage"
            class="absolute top-2 right-2 bg-dang-rejected text-white p-1 rounded-full hover:bg-opacity-80 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-5 py-2.5 border border-dang-light rounded-md hover:bg-dang-light text-dang-secondary transition-colors shadow-dang-sm"
      >
        취소
      </button>
      <button
        type="submit"
        class="px-5 py-2.5 bg-dang-primary text-white rounded-md hover:bg-dang-secondary transition-colors shadow-dang-md"
      >
        일기 저장하기
      </button>
    </div>
  </form>
</template>
