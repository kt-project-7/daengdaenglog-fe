<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, defineEmits } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { createDiaryMemoryImage } from '@/apis/diary'
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary, Mood, Weather } from '@/types/diary'
import MemorySection from './MemorySection.vue'
import DiaryEditModal from './DiaryEditModal.vue'
import { Edit, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  diary: Diary
  petName: string
}>()

const emit = defineEmits<{
  (e: 'generate-memory'): void
  (e: 'diary-updated'): void
  (e: 'diary-deleted'): void
}>()

const route = useRoute()
const diaryId = computed(() => Number(route.params.id))
const diaryStore = useDiaryStore()

const showEditModal = ref(false)
const isDeleting = ref(false)
const isGenerating = ref(false)

// 다이어리 데이터 불러오기
onMounted(async () => {
  if (diaryId.value && !isNaN(diaryId.value)) {
    await diaryStore.setCurrentDiaryId(diaryId.value.toString())
  }
})

// 수정 모달 열기
const openEditModal = () => {
  showEditModal.value = true
}

// 수정 모달 닫기
const closeEditModal = () => {
  showEditModal.value = false
}

// 일기 수정 저장
const saveDiary = async (updatedDiary: Diary) => {
  try {
    await diaryStore.updateDiary(diaryId.value)
    closeEditModal()
    emit('diary-updated')
  } catch (error) {
    console.error('일기 수정 중 오류가 발생했습니다:', error)
  }
}

// 일기 삭제
const deleteDiary = async () => {
  if (!confirm('정말로 이 일기를 삭제하시겠습니까?')) return

  try {
    isDeleting.value = true
    await diaryStore.deleteDiary(diaryId.value)
    emit('diary-deleted')
  } catch (error) {
    console.error('일기 삭제 중 오류가 발생했습니다:', error)
  } finally {
    isDeleting.value = false
  }
}

const diary = computed(() => diaryStore.currentDiary)
const memoryImage = computed(() =>
  diaryId.value ? diaryStore.getMemoryImage(diaryId.value.toString()) : '',
)

// 추억 생성 함수
const generateMemoryImage = async () => {
  if (!diaryId.value || isNaN(diaryId.value)) {
    console.warn('유효하지 않은 diaryId:', diaryId.value)
    return
  }

  try {
    isGenerating.value = true
    const result = await createDiaryMemoryImage(diaryId.value)
    diaryStore.setMemoryImage(
      diaryId.value.toString(),
      typeof result === 'string' ? result : result.imageUrl,
    )
  } catch (e) {
    console.error('추억 이미지 생성 실패:', e)
  } finally {
    isGenerating.value = false
  }
}

defineExpose({
  generateMemory: generateMemoryImage,
})
</script>

<template>
  <div v-if="diary" class="bg-white rounded-lg shadow-md overflow-hidden">
    <div v-if="diary.imageUrl" class="w-full h-64 md:h-80">
      <img
        :src="diary.imageUrl"
        :alt="`${formatDate(diary.date)} 일기 이미지`"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-6">
      <!-- 수정/삭제 버튼 추가 -->
      <div class="flex justify-end mb-4 gap-2">
        <button
          @click="openEditModal"
          class="flex items-center gap-1 px-3 py-1.5 bg-dang-primary bg-opacity-10 text-dang-primary rounded-md hover:bg-opacity-20 transition-colors"
        >
          <Edit class="w-4 h-4" />
          <span>수정</span>
        </button>
        <button
          @click="deleteDiary"
          :disabled="isDeleting"
          class="flex items-center gap-1 px-3 py-1.5 bg-dang-rejected bg-opacity-10 text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
        >
          <Trash2 class="w-4 h-4" />
          <span>{{ isDeleting ? '삭제 중...' : '삭제' }}</span>
        </button>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          class="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full"
        >
          {{ getMoodEmoji(diary.mood as Mood) }}
        </span>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {{ getWeatherEmoji(diary.weather as Weather) }}
        </span>
        <span
          v-if="diary.walkTime"
          class="px-3 py-1 bg-green-100 text-green-800 rounded-full"
        >
          산책: {{ diary.walkTime }}분
        </span>
        <span
          v-if="diary.mealTime"
          class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
        >
          식사: {{ diary.mealTime }}
        </span>
      </div>

      <div class="prose max-w-none">
        <p class="whitespace-pre-line body-text text-_black">
          {{ diary.content }}
        </p>
      </div>

      <MemorySection
        :memory-image="memoryImage"
        :pet-name="''"
        :diary-id="diaryId"
        :is-loading="isGenerating"
        @generate="generateMemoryImage"
      />
    </div>

    <!-- 수정 모달 -->
    <DiaryEditModal
      :show="showEditModal"
      :diary="diary"
      @close="closeEditModal"
      @save="saveDiary"
    />
  </div>
</template>
