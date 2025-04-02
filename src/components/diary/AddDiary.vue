<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { Camera, X, Plus } from 'lucide-vue-next'
import type { ScheduleType, EmotionType, WeatherType } from '@/types/diary'

const props = defineProps<{ petId: number }>()

const diaryStore = useDiaryStore()

const emit = defineEmits(['submit', 'cancel'])

const imageInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const form = reactive({
  title: '',
  content: '',
  emotionType: '' as EmotionType,
  weatherType: '' as WeatherType,
})

const activities = ref([{ type: 'walk', startTime: '', endTime: '' }])

const addActivity = () => {
  activities.value.push({ type: 'walk', startTime: '', endTime: '' })
}

const removeActivity = (index: number) => {
  activities.value.splice(index, 1)
}

const handleImageSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = () => {
      imagePreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = null
  imageFile.value = null
  if (imageInput.value) imageInput.value.value = ''
}

const openImageSelector = () => {
  imageInput.value?.click()
}

const handleSubmit = async () => {
  const diaryScheduleRequestList = activities.value.map((a) => {
    const [startHour, startMinute] = a.startTime.split(':').map(Number)
    const [endHour, endMinute] = a.endTime.split(':').map(Number)
    return {
      scheduleType: a.type === 'walk' ? 'WALK' : ('FEED' as ScheduleType),
      startHour,
      startMinute,
      endHour,
      endMinute,
    }
  })

  const payload = {
    petId: props.petId,
    title: form.title,
    content: form.content,
    emotionType: form.emotionType as EmotionType,
    weatherType: form.weatherType as WeatherType,
    diaryScheduleRequestList,
  }

  emit('submit', payload)
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-dang-background rounded-xl shadow-dang-md p-8 border border-dang-light"
  >
    <div class="mb-5">
      <label class="block text-dang-primary font-medium mb-2">제목</label>
      <input
        type="text"
        v-model="form.title"
        class="w-full px-3 py-2 border border-gray-200 rounded-md"
        required
      />
    </div>

    <div class="mb-5">
      <label class="block text-dang-primary font-medium mb-2">내용</label>
      <textarea
        v-model="form.content"
        rows="5"
        class="w-full px-3 py-2 border border-gray-200 rounded-md"
        required
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <div>
        <label class="block text-dang-primary font-medium mb-2">기분</label>
        <select
          v-model="form.emotionType"
          class="w-full px-3 py-2 border border-gray-200 rounded-md"
          required
        >
          <option value="" disabled>기분 선택</option>
          <option value="HAPPY">😊 행복</option>
          <option value="SAD">😢 슬픔</option>
          <option value="ANGRY">😠 화남</option>
          <option value="SURPRISED">😲 놀람</option>
          <option value="HUNGRY">🍴 배고픔</option>
          <option value="SICK">🤕 아픔</option>
          <option value="LOVE">💖 사랑</option>
          <option value="SLEEPY">😴 졸림</option>
        </select>
      </div>
      <div>
        <label class="block text-dang-primary font-medium mb-2">날씨</label>
        <select
          v-model="form.weatherType"
          class="w-full px-3 py-2 border border-gray-200 rounded-md"
          required
        >
          <option value="" disabled>날씨 선택</option>
          <option value="SUNNY">☀️ 맑음</option>
          <option value="CLOUDY">☁️ 흐림</option>
          <option value="RAINY">🌧️ 비</option>
          <option value="SNOWY">❄️ 눈</option>
          <option value="THUNDER">⚡️ 번개</option>
          <option value="HAILSTONE">🌨️ 우박</option>
          <option value="FOG">🌫️ 안개</option>
          <option value="YELLOW_DUST">💨 황사</option>
        </select>
      </div>
    </div>

    <div class="mb-5">
      <div class="flex justify-between items-center mb-2">
        <label class="block text-dang-primary font-medium">오늘의 활동</label>
        <button
          type="button"
          @click="addActivity"
          class="flex items-center text-dang-primary"
        >
          <Plus class="w-5 h-5 mr-1" /> <span>활동 추가</span>
        </button>
      </div>
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="flex items-center gap-3 mb-3"
      >
        <select v-model="activity.type" class="px-3 py-2 border rounded">
          <option value="walk">산책</option>
          <option value="meal">식사</option>
        </select>
        <input
          type="time"
          v-model="activity.startTime"
          class="px-2 py-1 border rounded"
        />
        <span>~</span>
        <input
          type="time"
          v-model="activity.endTime"
          class="px-2 py-1 border rounded"
        />
        <button type="button" @click="removeActivity(index)">🗑️</button>
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-dang-primary font-medium mb-2">이미지</label>
      <div class="border-2 border-dashed border-gray-200 p-4 text-center rounded-lg">
        <input
          type="file"
          ref="imageInput"
          class="hidden"
          accept="image/*"
          @change="handleImageSelect"
        />
        <div v-if="!imagePreview" class="py-8">
          <Camera class="w-8 h-8 mx-auto mb-2 text-dang-secondary" />
          <p class="text-sm text-dang-secondary">이미지를 업로드 해주세요</p>
          <button
            type="button"
            @click="openImageSelector"
            class="mt-2 px-4 py-1 bg-dang-primary text-white rounded"
          >
            이미지 선택
          </button>
        </div>
        <div v-else class="relative">
          <img :src="imagePreview" class="max-h-64 mx-auto rounded" />
          <button
            type="button"
            @click="removeImage"
            class="absolute top-2 right-2"
          >
            ❌
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border rounded"
      >
        취소
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-dang-primary text-white rounded"
      >
        작성 완료
      </button>
    </div>
  </form>
</template>
