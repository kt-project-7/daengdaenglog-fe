<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diaryStore'
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary, EmotionType, WeatherType } from '@/types/diary'
import type { CreateDiaryRequest } from '@/types/diary'
import EditDiaryModal from '@/components/diary/EditDiaryModal.vue'
import { Edit, Trash2, MoreVertical } from 'lucide-vue-next'

const router = useRouter()
const diaryStore = useDiaryStore()

// 날짜 필터 입력값
const dateFilter = ref({ start: '', end: '' })
const appliedDateFilter = ref({ start: '', end: '' })
const dateFilterError = ref('')
const selectedMood = ref<EmotionType | 'all'>('all')
const sortOption = ref<'newest' | 'oldest'>('newest')

const itemsPerPage = 5
const currentPage = ref(1)
const isLoading = ref(false)
const hasMoreData = ref(true)
const observer = ref<IntersectionObserver | null>(null)
const loadingTriggerRef = ref<HTMLElement | null>(null)

const showEditModal = ref(false)
const currentEditDiary = ref<Diary | null>(null)
const showDeleteConfirm = ref(false)
const diaryToDelete = ref<number | null>(null)
const openDropdownId = ref<number | null>(null)

const moodOptions: EmotionType[] = [
  'HAPPY',
  'SAD',
  'ANGRY',
  'SURPRISED',
  'HUNGRY',
  'SICK',
  'LOVE',
  'SLEEPY',
]

const filteredDiaries = computed(() => {
  let result = [...diaryStore.diaries]

  if (appliedDateFilter.value.start) {
    const startDate = new Date(appliedDateFilter.value.start)
    result = result.filter((diary) => new Date(diary.createdDate) >= startDate)
  }
  if (appliedDateFilter.value.end) {
    const endDate = new Date(appliedDateFilter.value.end)
    endDate.setDate(endDate.getDate() + 1)
    result = result.filter((diary) => new Date(diary.createdDate) < endDate)
  }
  if (selectedMood.value !== 'all') {
    result = result.filter((diary) => diary.emotionType === selectedMood.value)
  }
  result.sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime()
    const dateB = new Date(b.createdDate).getTime()
    return sortOption.value === 'newest' ? dateB - dateA : dateA - dateB
  })
  return result
})

const visibleDiaries = computed(() => {
  const endIndex = currentPage.value * itemsPerPage
  return filteredDiaries.value.slice(0, endIndex)
})

const handleStartDateChange = () => {
  if (
    dateFilter.value.start &&
    dateFilter.value.end &&
    new Date(dateFilter.value.end) < new Date(dateFilter.value.start)
  ) {
    dateFilter.value.end = ''
  }
  dateFilterError.value = ''
}

const applyDateFilter = () => {
  if (dateFilter.value.start && dateFilter.value.end) {
    const startDate = new Date(dateFilter.value.start)
    const endDate = new Date(dateFilter.value.end)
    if (endDate < startDate) {
      dateFilterError.value = '종료일은 시작일보다 빠를 수 없습니다.'
      return
    }
  }
  dateFilterError.value = ''
  appliedDateFilter.value.start = dateFilter.value.start
  appliedDateFilter.value.end = dateFilter.value.end
  resetInfiniteScroll()
}

const resetDateFilter = () => {
  dateFilter.value = { start: '', end: '' }
  appliedDateFilter.value = { start: '', end: '' }
  dateFilterError.value = ''
  resetInfiniteScroll()
}

const changeMoodFilter = (mood: EmotionType | 'all') => {
  selectedMood.value = selectedMood.value === mood ? 'all' : mood
  resetInfiniteScroll()
}

const changeSortOption = (e: Event) => {
  sortOption.value = (e.target as HTMLSelectElement).value as
    | 'newest'
    | 'oldest'
  resetInfiniteScroll()
}

const resetAllFilters = () => {
  resetDateFilter()
  selectedMood.value = 'all'
  sortOption.value = 'newest'
  resetInfiniteScroll()
}

const resetInfiniteScroll = () => {
  currentPage.value = 1
  hasMoreData.value = true
}

const loadMoreData = () => {
  if (isLoading.value || !hasMoreData.value) return
  isLoading.value = true
  setTimeout(() => {
    const total = filteredDiaries.value.length
    if (currentPage.value * itemsPerPage >= total) {
      hasMoreData.value = false
    } else {
      currentPage.value++
    }
    isLoading.value = false
  }, 300)
}

const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value && hasMoreData.value) {
        loadMoreData()
      }
    },
    { threshold: 0.5 },
  )
  if (loadingTriggerRef.value) observer.value.observe(loadingTriggerRef.value)
}

const viewDiary = (id: number) => {
  router.push(`/diary/${id}`)
}

const goToWrite = () => {
  router.push('/diary-write')
}

const loadDiaryData = async () => {
  try {
    await diaryStore.loadDiaries()
    setupIntersectionObserver()
  } catch (e) {
    console.error('일기 로딩 실패:', e)
  }
}

const openEditModal = (diary: Diary) => {
  currentEditDiary.value = diary
  showEditModal.value = true
  closeDropdown()
}

const saveDiaryEdit = async (payload: CreateDiaryRequest) => {
  if (!currentEditDiary.value) return
  await diaryStore.editDiary(currentEditDiary.value.diaryId, payload)
  showEditModal.value = false
  currentEditDiary.value = null
}

const confirmDelete = (id: number) => {
  diaryToDelete.value = id
  showDeleteConfirm.value = true
  closeDropdown()
}

const deleteDiary = async () => {
  if (diaryToDelete.value != null) {
    await diaryStore.removeDiary(diaryToDelete.value)
    showDeleteConfirm.value = false
    diaryToDelete.value = null
  }
}

const toggleDropdown = (id: number, e: Event) => {
  e.stopPropagation()
  openDropdownId.value = openDropdownId.value === id ? null : id
}

const closeDropdown = () => {
  openDropdownId.value = null
}

const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    openDropdownId.value !== null &&
    !target.closest('.dropdown-menu') &&
    !target.closest('.dropdown-trigger')
  ) {
    openDropdownId.value = null
  }
}

onMounted(() => {
  loadDiaryData()
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  observer.value?.disconnect()
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div
    class="min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]"
  >
    <main class="container mx-auto px-4 py-8" style="max-width: 1280px">
      <div>
        <div class="text-center mb-10">
          <div class="inline-block relative">
            <h1 class="text-4xl font-bold text-dang-primary relative z-10">
              나의 댕댕이 관찰일기
            </h1>
            <div
              class="absolute -bottom-3 left-0 right-0 h-3 bg-chart-category3 opacity-30 rounded-full"
            ></div>

            <!-- 강아지 발자국 장식 -->
            <div
              class="absolute -top-6 -left-8 text-chart-category3 opacity-30 transform rotate-12"
            >
              🐾
            </div>
            <div
              class="absolute -bottom-6 -right-8 text-chart-category3 opacity-30 transform -rotate-12"
            >
              🐾
            </div>
          </div>
          <p class="mt-3 text-dang-secondary">
            소중한 반려견과의 일상을 기록하세요
          </p>
        </div>

        <div class="flex justify-end mb-6">
          <button
            @click="goToWrite"
            class="bg-dang-primary text-white px-5 py-2 rounded-lg hover:bg-dang-secondary transition-colors flex items-center shadow-dang-md"
          >
            <span class="mr-1">+</span> 새 일기
          </button>
        </div>

        <!-- 일기가 없을 경우 표시 -->
        <div
          v-if="filteredDiaries.length === 0"
          class="text-center py-16 bg-dang-background rounded-xl shadow-dang-sm"
        >
          <p class="text-xl text-dang-primary mb-4">일기가 없습니다</p>
          <p class="text-dang-secondary mb-6">
            다른 필터 조건으로 다시 시도해 보세요.
          </p>
          <button
            @click="resetAllFilters"
            class="inline-block bg-dang-primary text-white px-6 py-2 rounded-lg hover:bg-dang-secondary transition-colors shadow-dang-md"
          >
            전체 보기
          </button>
        </div>

        <div v-else>
          <!-- 일기가 있을 경우 보여주는 목록 -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div
              v-for="diary in visibleDiaries"
              :key="diary.diaryId"
              class="md:col-span-4 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 group border border-dang-light relative"
            >
              <div class="relative h-80">
                <img
                  :src="
                    diary.generatedImageUri ||
                    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2376&auto=format&fit=crop'
                  "
                  :alt="`${formatDate(diary.createdDate)} 일기 이미지`"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 p-6 text-white">
                  <h2 class="text-2xl font-bold mb-1">
                    {{ formatDate(diary.createdDate) }}
                  </h2>
                  <p class="line-clamp-2 text-_gray-100">
                    {{ diary.content }}
                  </p>
                </div>
                <div
                  v-if="diary.memoryUri"
                  class="absolute top-4 right-4 bg-dang-primary/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center"
                >
                  <span class="mr-1">✨</span>
                  <span>추억</span>
                </div>

                <!-- 수정/삭제 드롭다운 -->
                <div class="absolute top-4 left-4 z-20">
                  <button
                    @click="toggleDropdown(diary.diaryId, $event)"
                    class="p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <div
                    v-if="openDropdownId === diary.diaryId"
                    class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu"
                  >
                    <button
                      @click.stop="openEditModal(diary)"
                      class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                      <span>수정</span>
                    </button>
                    <button
                      @click.stop="confirmDelete(diary.diaryId)"
                      class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                      <Trash2 class="w-4 h-4" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>

                <!-- 클릭 영역 -->
                <div
                  class="absolute inset-0 cursor-pointer z-10"
                  @click="viewDiary(diary.diaryId)"
                ></div>
              </div>
            </div>
          </div>

          <!-- 무한 스크롤 로딩 표시기 -->
          <div
            v-if="hasMoreData"
            ref="loadingTriggerRef"
            class="flex justify-center items-center py-8"
          >
            <div v-if="isLoading" class="text-dang-primary">
              <svg
                class="animate-spin h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 일기 수정 모달 -->
    <EditDiaryModal
      :show="showEditModal"
      :diary="currentEditDiary"
      @close="showEditModal = false"
      @save="saveDiaryEdit"
    />

    <!-- 삭제 확인 모달 -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-xl shadow-dang-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-dang-primary mb-4">일기 삭제</h3>
        <p class="text-dang-secondary mb-6">
          정말 이 일기를 삭제하시겠습니까? 삭제된 일기는 복구할 수 없습니다.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-dang-light rounded-md hover:bg-dang-light text-dang-secondary transition-colors"
          >
            취소
          </button>
          <button
            @click="deleteDiary"
            class="px-4 py-2 bg-dang-rejected text-black rounded-md hover:bg-opacity-80 transition-colors"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 드롭다운 메뉴 애니메이션 */
.dropdown-menu {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
