<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { Camera, X } from 'lucide-vue-next'
import type { Diary, Mood, Weather } from '@/types/diary'

const props = defineProps<{
  show: boolean
  diary: Diary | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', diary: Diary): void
}>()

const diaryStore = useDiaryStore()

// 수정할 일기 데이터
const editedDiary = ref<Diary | null>(null)

// 이미지 업로드 관련
const imageInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)

// props.diary가 변경될 때 editedDiary 업데이트
watch(() => props.diary, (newDiary) => {
  if (newDiary) {
    // 깊은 복사를 통해 원본 데이터 변경 방지
    editedDiary.value = JSON.parse(JSON.stringify(newDiary))
    imagePreview.value = newDiary.imageUrl || null
  }
}, { immediate: true })

// 이미지 선택 처리
const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target && editedDiary.value) {
        imagePreview.value = e.target.result as string
        editedDiary.value.imageUrl = e.target.result as string
      }
    }
    
    reader.readAsDataURL(file)
  }
}

// 이미지 제거
const removeImage = () => {
  imagePreview.value = null
  if (editedDiary.value) {
    editedDiary.value.imageUrl = undefined
  }
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 이미지 선택 창 열기
const openImageSelector = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// 수정 저장
const saveDiary = () => {
  if (editedDiary.value) {
    emit('save', editedDiary.value)
  }
}

// 모달 닫기
const closeModal = () => {
  emit('close')
}

// ESC 키로 모달 닫기
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    closeModal()
  }
}

// 모달 외부 클릭 시 닫기
const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.classList.contains('modal-overlay')) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden' // 모달 열릴 때 스크롤 방지
  } else {
    document.body.style.overflow = '' // 모달 닫힐 때 스크롤 복원
  }
})
</script>

<template>
  <div v-if="show && editedDiary" class="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black bg-opacity-50" @click="handleOutsideClick">
    <div class="bg-dang-background rounded-xl shadow-dang-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-dang-primary">일기 수정하기</h2>
        <button 
          @click="closeModal"
          class="text-dang-secondary hover:text-dang-primary p-1 rounded-full transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="saveDiary" class="space-y-5">
        <div>
          <label class="block text-dang-primary font-medium mb-2">날짜</label>
          <input
            type="date"
            v-model="editedDiary.date"
            class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
            :max="diaryStore.today"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-dang-primary font-medium mb-2">댕댕이 기분</label>
            <select
              v-model="editedDiary.mood"
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
              v-model="editedDiary.weather"
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

        <div>
          <label class="block text-dang-primary font-medium mb-2">관찰 내용</label>
          <textarea
            v-model="editedDiary.content"
            rows="5"
            class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
            placeholder="오늘 댕댕이는 어땠나요? 특별한 행동이나 변화가 있었나요?"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-dang-primary font-medium mb-2">오늘의 산책 시간 (분)</label>
            <input
              type="number"
              v-model="editedDiary.walkTime"
              min="0"
              class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
              placeholder="예: 30"
            />
          </div>

          <div>
            <label class="block text-dang-primary font-medium mb-2">오늘의 식사 시간</label>
            <input
              type="text"
              v-model="editedDiary.mealTime"
              class="w-full px-3 py-2 border border-dang-light rounded-md focus:outline-none focus:ring-2 focus:ring-dang-primary bg-white"
              placeholder="예: 아침 8시, 저녁 6시"
            />
          </div>
        </div>

        <div>
          <label class="block text-dang-primary font-medium mb-2">일기 이미지</label>
          <div 
            class="relative border-2 border-dashed border-dang-light rounded-lg p-4 text-center hover:border-dang-primary transition-colors"
            :class="{'bg-dang-light bg-opacity-20': !imagePreview}"
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
              <p class="text-dang-secondary text-sm mb-4">JPG, PNG 파일 (최대 5MB)</p>
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
              <button
                type="button"
                @click="openImageSelector"
                class="mt-4 px-3 py-1.5 bg-dang-primary bg-opacity-10 text-dang-primary rounded-md hover:bg-opacity-20 transition-colors text-sm"
              >
                다른 이미지 선택
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-dang-light">
          <button
            type="button"
            @click="closeModal"
            class="px-5 py-2.5 border border-dang-light rounded-md hover:bg-dang-light text-dang-secondary transition-colors shadow-dang-sm"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-5 py-2.5 bg-dang-primary text-white rounded-md hover:bg-dang-secondary transition-colors shadow-dang-md"
          >
            저장하기
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