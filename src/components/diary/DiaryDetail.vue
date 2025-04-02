<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDiaryStore } from '@/stores/diaryStore'
import { getMoodEmoji, getWeatherEmoji, formatDate } from '@/utils/formatters'
import { Edit, Trash2 } from 'lucide-vue-next'
import EditDiaryModal from './EditDiaryModal.vue'
import MemorySection from './MemorySection.vue'

const diaryStore = useDiaryStore()
const diary = computed(() => diaryStore.selectedDiary)
const showEditModal = ref(false)
const isDeleting = ref(false)
const isGenerating = ref(false)

const openEditModal = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleGenerateMemory = async () => {
  if (!diary.value) return
  try {
    isGenerating.value = true
    // 이미지 생성이 완료될 때까지 대기
    const imageUrl = await diaryStore.generateImage(diary.value.diaryId)

    // 이미지 생성 완료 확인
    console.log('이미지 생성 완료:', imageUrl)

    // 필요시 다시 다이어리 상세 정보를 로드해 최신 상태로 갱신
    if (!diary.value.generatedImageUri) {
      await diaryStore.loadDiaryDetail(diary.value.diaryId)
    }
  } catch (e) {
    console.error('이미지 생성 실패:', e)
    alert('이미지 생성에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isGenerating.value = false
  }
}

const deleteDiary = async () => {
  if (!diary.value) return
  if (!confirm('정말로 이 일기를 삭제하시겠습니까?')) return
  try {
    isDeleting.value = true
    await diaryStore.removeDiary(diary.value.diaryId)
  } catch (e) {
    console.error('삭제 실패:', e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div v-if="diary" class="bg-white rounded-lg shadow-md overflow-hidden">
    <div
      v-if="diary.memoryUri || diary.generatedImageUri"
      class="w-full h-64 md:h-80"
    >
      <img
        :src="diary.memoryUri || diary.generatedImageUri || ''"
        :alt="`${formatDate(diary.createdDate)} 일기 이미지`"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-6">
      <!-- 수정/삭제 버튼 -->
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
          {{ getMoodEmoji(diary.emotionType) }}
        </span>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {{ getWeatherEmoji(diary.weatherType) }}
        </span>
        <span
          v-for="s in diary.scheduleList.filter(
            (s) => s.scheduleType === 'WALK',
          )"
          :key="s.scheduleId"
          class="px-3 py-1 bg-green-100 text-green-800 rounded-full"
        >
          산책: {{ s.startTime }} ~ {{ s.endTime }}
        </span>
        <span
          v-for="s in diary.scheduleList.filter(
            (s) => s.scheduleType === 'FEED',
          )"
          :key="s.scheduleId"
          class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
        >
          식사: {{ s.startTime }} ~ {{ s.endTime }}
        </span>
      </div>

      <div class="prose max-w-none">
        <p class="whitespace-pre-line body-text text-_black">
          {{ diary.content }}
        </p>
      </div>

      <div class="mt-6">
        <MemorySection
          :memory-image="diary.memoryUri || undefined"
          :pet-name="''"
          :diary-id="diary.diaryId"
          :is-loading="isGenerating"
          @generate="handleGenerateMemory"
        />
      </div>
    </div>

    <EditDiaryModal
      :show="showEditModal"
      :diary="diary"
      @close="closeEditModal"
      @save="closeEditModal"
    />
  </div>
</template>
