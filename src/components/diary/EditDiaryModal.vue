<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { Camera, X, Plus } from 'lucide-vue-next'
import type {
  Diary,
  ScheduleType,
  EmotionType,
  WeatherType,
} from '@/types/diary'
import Swal from 'sweetalert2'

const props = defineProps<{
  show: boolean
  diary: Diary | null
}>()

const emit = defineEmits(['close', 'save'])

const diaryStore = useDiaryStore()

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

// diary가 변경될 때 실행되는 watch
watch(
  () => props.diary,
  (newDiary) => {
    if (!newDiary) return

    // 폼 초기화
    form.title = newDiary.title
    form.content = newDiary.content
    form.emotionType = newDiary.emotionType
    form.weatherType = newDiary.weatherType

    if (newDiary.scheduleList && newDiary.scheduleList.length > 0) {
      activities.value = newDiary.scheduleList.map((schedule) => {
        // 시간에서 시와 분 추출
        const startTimeParts = schedule.startTime.split(':')
        const endTimeParts = schedule.endTime.split(':')

        return {
          type: schedule.scheduleType === 'WALK' ? 'walk' : 'meal',
          startTime: schedule.startTime.substring(0, 5), // HH:MM 형식으로 자르기
          endTime: schedule.endTime.substring(0, 5), // HH:MM 형식으로 자르기
        }
      })
    } else {
      // 기본 활동 설정
      activities.value = [{ type: 'walk', startTime: '', endTime: '' }]
    }

    // 이미지 초기화 - memoryUri를 우선적으로 사용
    imagePreview.value =
      newDiary.memoryUri || newDiary.generatedImageUri || null
  },
  { immediate: true },
)

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

  if (!props.diary || typeof props.diary.petId !== 'number') {
    Swal.fire({
      icon: 'error',
      title: '정보 오류',
      text: '반려동물 정보를 불러올 수 없습니다.',
      confirmButtonText: '확인',
    })
    return
  }

  const payload = {
    petId: props.diary.petId,
    title: form.title,
    content: form.content,
    emotionType: form.emotionType as EmotionType,
    weatherType: form.weatherType as WeatherType,
    diaryScheduleRequestList,
  }

  try {
    await diaryStore.editDiary(
      props.diary.diaryId,
      payload,
      imageFile.value || undefined,
    )
    emit('save', payload)
  } catch (err) {
    console.error('수정 실패:', err)
    Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: '일기 수정에 실패했습니다.',
      confirmButtonText: '확인',
    })
  }
}
</script>

<template>
  <div
    v-if="props.show"
    class="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black bg-opacity-50 overflow-hidden"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <form @submit.prevent="handleSubmit">
        <div class="mb-5">
          <label class="block text-dang-primary font-medium mb-2">제목</label>
          <input
            type="text"
            v-model="form.title"
            class="w-full px-3 py-2 border border-dang-light rounded-md"
            required
          />
        </div>

        <div class="mb-5">
          <label class="block text-dang-primary font-medium mb-2">내용</label>
          <textarea
            v-model="form.content"
            rows="5"
            class="w-full px-3 py-2 border border-dang-light rounded-md"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label class="block text-dang-primary font-medium mb-2">기분</label>
            <select
              v-model="form.emotionType"
              class="w-full px-3 py-2 border border-dang-light rounded-md"
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
              class="w-full px-3 py-2 border border-dang-light rounded-md"
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
            <label class="block text-dang-primary font-medium"
              >오늘의 활동</label
            >
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
          <div class="border-2 border-dashed p-4 text-center rounded-lg">
            <input
              type="file"
              ref="imageInput"
              class="hidden"
              accept="image/*"
              @change="handleImageSelect"
            />
            <div v-if="!imagePreview" class="py-8">
              <Camera class="w-8 h-8 mx-auto mb-2 text-dang-secondary" />
              <p class="text-sm text-dang-secondary">
                이미지를 업로드 해주세요
              </p>
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
            @click="$emit('close')"
            class="px-4 py-2 border rounded"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-dang-primary text-white rounded"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  backdrop-filter: blur(2px);
}
</style>
