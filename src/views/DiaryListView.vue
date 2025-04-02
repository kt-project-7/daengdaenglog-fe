<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diaryStore'
import { usePetStore } from '@/stores/petStore'
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary, EmotionType, WeatherType } from '@/types/diary'
import type { CreateDiaryRequest } from '@/types/diary'
import EditDiaryModal from '@/components/diary/EditDiaryModal.vue'
import PetSelector from '@/components/profile/PetSelector.vue'
import { Edit, Trash2, MoreVertical } from 'lucide-vue-next'
import LogoSvg from '@/assets/svgs/default.svg'

const router = useRouter()
const diaryStore = useDiaryStore()
const petStore = usePetStore()

// 날짜 필터 입력값
const dateFilter = ref({ start: '', end: '' })
const appliedDateFilter = ref({ start: '', end: '' })
const dateFilterError = ref('')
const selectedMood = ref<EmotionType | 'all'>('all')
const sortOption = ref<'newest' | 'oldest'>('newest')

// Pet selection
const selectedPetIndex = ref(0)

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

  // Filter by selected pet
  if (petStore.pets.length > 0) {
    const selectedPetId = petStore.pets[selectedPetIndex.value]?.id
    if (selectedPetId) {
      result = result.filter((diary) => diary.petId === selectedPetId)
    }
  }

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

const handlePetSwitch = (index: number) => {
  selectedPetIndex.value = index
  currentPage.value = 1 // Reset to first page when changing pets
}

onMounted(async () => {
  await petStore.fetchPets()
  await loadDiaryData()
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

        <!-- Pet Selector -->
        <div
          v-if="petStore.pets.length > 0"
          class="mb-6 bg-dang-background p-4 rounded-lg shadow-dang-sm border border-dang-light"
        >
          <h3 class="text-sm font-medium text-dang-secondary mb-2">
            반려견 선택
          </h3>
          <PetSelector
            :pets="petStore.pets"
            :current-pet-index="selectedPetIndex"
            @switch="handlePetSwitch"
          />
        </div>

        <!-- 필터 및 정렬 옵션 -->
        <div
          class="bg-dang-background p-5 rounded-lg shadow-dang-sm mb-6 border border-dang-light"
        >
          <!-- 날짜별 검색 -->
          <div class="mb-4">
            <h3 class="text-sm font-medium text-dang-secondary mb-2">
              날짜별 검색
            </h3>
            <div class="flex flex-wrap gap-3">
              <div class="flex items-center">
                <label class="text-sm text-dang-secondary mr-2">시작일:</label>
                <input
                  type="date"
                  v-model="dateFilter.start"
                  @change="handleStartDateChange"
                  class="border border-dang-light rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary"
                />
              </div>
              <div class="flex items-center">
                <label class="text-sm text-dang-secondary mr-2">종료일:</label>
                <input
                  type="date"
                  v-model="dateFilter.end"
                  :min="dateFilter.start || undefined"
                  class="border border-dang-light rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary"
                />
              </div>
              <button
                @click="applyDateFilter"
                class="bg-dang-primary bg-opacity-10 text-dang-secondary px-3 py-1 rounded-md text-sm hover:bg-opacity-20"
              >
                적용
              </button>
              <button
                @click="resetDateFilter"
                class="bg-dang-light text-dang-secondary px-3 py-1 rounded-md text-sm hover:bg-dang-pending"
              >
                초기화
              </button>
            </div>
            <p
              v-if="dateFilterError"
              class="mt-2 text-dang-rejected-text text-xs"
            >
              {{ dateFilterError }}
            </p>
          </div>

          <div
            class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >
            <!-- 기분별 필터 -->
            <div>
              <h3 class="text-sm font-medium text-dang-secondary mb-2">
                기분별 필터
              </h3>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="changeMoodFilter('all')"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    selectedMood === 'all'
                      ? 'bg-dang-primary text-white'
                      : 'bg-dang-primary bg-opacity-10 text-dang-secondary hover:bg-opacity-20'
                  "
                >
                  전체
                </button>
                <button
                  v-for="mood in moodOptions"
                  :key="mood"
                  @click="changeMoodFilter(mood)"
                  class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  :class="
                    selectedMood === mood
                      ? 'bg-dang-primary text-white'
                      : 'bg-dang-light text-dang-secondary hover:bg-dang-pending'
                  "
                >
                  <span class="mr-1">{{
                    getMoodEmoji(mood).split(' ')[0]
                  }}</span>
                  {{ getMoodEmoji(mood).split(' ')[1] }}
                </button>
              </div>
            </div>

            <!-- 정렬 옵션 -->
            <div class="flex items-center">
              <span class="text-sm text-dang-secondary mr-2">정렬:</span>
              <select
                @change="changeSortOption"
                v-model="sortOption"
                class="bg-dang-light border-0 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary"
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
              </select>
            </div>
          </div>
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
          <!-- 매거진 스타일 그리드 -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- 첫 번째 일기 (큰 카드) -->
            <div
              v-if="visibleDiaries.length > 0"
              class="md:col-span-8 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 group border border-dang-light relative"
            >
              <div class="relative h-80">
                <img
                  :src="
                    visibleDiaries[0].memoryUri ||
                    visibleDiaries[0].generatedImageUri ||
                    LogoSvg
                  "
                  :alt="`${formatDate(visibleDiaries[0].createdDate)} 일기 이미지`"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 p-6 text-white">
                  <div class="flex gap-2 mb-2">
                    <span
                      class="px-3 py-1 bg-dang-primary/80 rounded-full text-sm backdrop-blur-sm"
                    >
                      <span class="mr-1">{{
                        getMoodEmoji(visibleDiaries[0].emotionType).split(
                          ' ',
                        )[0]
                      }}</span>
                      {{
                        getMoodEmoji(visibleDiaries[0].emotionType).split(
                          ' ',
                        )[1]
                      }}
                    </span>
                    <span
                      class="px-3 py-1 bg-chart-category3/80 rounded-full text-sm backdrop-blur-sm"
                    >
                      {{ getWeatherEmoji(visibleDiaries[0].weatherType) }}
                    </span>
                  </div>
                  <h2 class="text-2xl font-bold mb-1">
                    {{ formatDate(visibleDiaries[0].createdDate) }}
                  </h2>
                  <p class="line-clamp-2 text-_gray-100">
                    {{ visibleDiaries[0].content }}
                  </p>
                </div>

                <div
                  v-if="visibleDiaries[0].memoryUri"
                  class="absolute top-4 right-4 bg-dang-primary/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center"
                >
                  <span class="mr-1">✨</span>
                  <span>추억</span>
                </div>

                <!-- 수정/삭제 드롭다운 -->
                <div class="absolute top-4 right-4 z-20">
                  <button
                    @click="toggleDropdown(visibleDiaries[0].diaryId, $event)"
                    class="p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <div
                    v-if="openDropdownId === visibleDiaries[0].diaryId"
                    class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu"
                  >
                    <button
                      @click.stop="openEditModal(visibleDiaries[0])"
                      class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                      <span>수정</span>
                    </button>
                    <button
                      @click.stop="confirmDelete(visibleDiaries[0].diaryId)"
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
                  @click="viewDiary(visibleDiaries[0].diaryId)"
                ></div>
              </div>
            </div>

            <!-- 두 번째 일기 (중간 카드) -->
            <div
              v-if="visibleDiaries.length > 1"
              class="md:col-span-4 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 group border border-dang-light relative"
            >
              <div class="relative h-80">
                <img
                  :src="
                    visibleDiaries[1].memoryUri ||
                    visibleDiaries[1].generatedImageUri ||
                    LogoSvg
                  "
                  :alt="`${formatDate(visibleDiaries[1].createdDate)} 일기 이미지`"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                  <div class="flex gap-2 mb-2">
                    <span
                      class="px-2 py-1 bg-dang-primary/80 rounded-full text-xs backdrop-blur-sm"
                    >
                      <span class="mr-1">{{
                        getMoodEmoji(visibleDiaries[1].emotionType).split(
                          ' ',
                        )[0]
                      }}</span>
                      {{
                        getMoodEmoji(visibleDiaries[1].emotionType).split(
                          ' ',
                        )[1]
                      }}
                    </span>
                    <span
                      class="px-2 py-1 bg-chart-category3/80 rounded-full text-xs backdrop-blur-sm"
                    >
                      {{ getWeatherEmoji(visibleDiaries[1].weatherType) }}
                    </span>
                  </div>
                  <h2 class="text-xl font-bold mb-1">
                    {{ formatDate(visibleDiaries[1].createdDate) }}
                  </h2>
                  <p class="line-clamp-2 text-sm text-_gray-100">
                    {{ visibleDiaries[1].content }}
                  </p>
                </div>

                <div
                  v-if="visibleDiaries[1].memoryUri"
                  class="absolute top-4 right-4 bg-dang-primary/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center"
                >
                  <span class="mr-1">✨</span>
                  <span>추억</span>
                </div>

                <!-- 수정/삭제 드롭다운 -->
                <div class="absolute top-4 right-4 z-20">
                  <button
                    @click="toggleDropdown(visibleDiaries[1].diaryId, $event)"
                    class="p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <div
                    v-if="openDropdownId === visibleDiaries[1].diaryId"
                    class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu"
                  >
                    <button
                      @click.stop="openEditModal(visibleDiaries[1])"
                      class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                      <span>수정</span>
                    </button>
                    <button
                      @click.stop="confirmDelete(visibleDiaries[1].diaryId)"
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
                  @click="viewDiary(visibleDiaries[1].diaryId)"
                ></div>
              </div>
            </div>

            <!-- 나머지 일기들 (작은 카드) -->
            <div
              v-for="diary in visibleDiaries.slice(2)"
              :key="diary.diaryId"
              class="md:col-span-4 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 border border-dang-light relative"
            >
              <div class="flex flex-col h-full">
                <div class="h-48 overflow-hidden relative">
                  <img
                    :src="diary.memoryUri || diary.generatedImageUri || LogoSvg"
                    :alt="`${formatDate(diary.createdDate)} 일기 이미지`"
                    class="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />

                  <!-- 수정/삭제 드롭다운 -->
                  <div class="absolute top-4 right-4 z-20">
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
                </div>

                <div class="p-5 flex-grow flex flex-col relative">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-lg text-dang-primary">
                      {{ formatDate(diary.createdDate) }}
                    </h3>
                    <div
                      v-if="diary.memoryUri"
                      class="bg-dang-primary bg-opacity-10 text-dang-primary px-2 py-1 rounded-full text-xs flex items-center"
                    >
                      <span class="mr-1">✨</span>
                      <span>추억</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 mb-3">
                    <span
                      class="text-xs px-2 py-1 bg-dang-primary bg-opacity-10 rounded-full"
                    >
                      <span class="mr-1">{{
                        getMoodEmoji(diary.emotionType).split(' ')[0]
                      }}</span>
                      {{ getMoodEmoji(diary.emotionType).split(' ')[1] }}
                    </span>
                    <span
                      class="text-xs px-2 py-1 bg-dang-light rounded-full"
                      >{{ getWeatherEmoji(diary.weatherType) }}</span
                    >
                    <span
                      v-for="s in (diary.scheduleList || []).filter(
                        (s) => s?.scheduleType === 'WALK',
                      )"
                      :key="s.scheduleId"
                      class="text-xs px-2 py-1 bg-dang-light rounded-full"
                    >
                      산책: {{ s.startTime.substring(0, 5) }} ~
                      {{ s.endTime.substring(0, 5) }}
                    </span>
                  </div>

                  <p class="text-_black line-clamp-3 mb-3 text-sm flex-grow">
                    {{ diary.content }}
                  </p>

                  <div
                    class="flex justify-between items-center mt-auto pt-2 border-t border-dang-light"
                  >
                    <span
                      v-if="
                        (diary.scheduleList || []).some(
                          (s) => s?.scheduleType === 'FEED',
                        )
                      "
                      class="text-xs text-dang-secondary"
                    >
                      식사:
                      {{
                        (diary.scheduleList || [])
                          .find((s) => s?.scheduleType === 'FEED')
                          ?.startTime?.substring(0, 5)
                      }}
                      ~
                      {{
                        (diary.scheduleList || [])
                          .find((s) => s?.scheduleType === 'FEED')
                          ?.endTime?.substring(0, 5)
                      }}
                    </span>
                    <button
                      @click.stop="viewDiary(diary.diaryId)"
                      class="text-dang-primary text-xs hover:opacity-80"
                    >
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>

              <!-- 클릭 영역 (이미지와 내용 영역만) -->
              <div
                class="absolute inset-0 cursor-pointer z-10"
                @click="viewDiary(diary.diaryId)"
              ></div>
            </div>
          </div>

          <!-- 무한 스크롤 로딩 표시 -->
          <div
            ref="loadingTriggerRef"
            class="mt-8 text-center py-4"
            v-if="filteredDiaries.length > visibleDiaries.length || isLoading"
          >
            <div
              v-if="isLoading"
              class="flex justify-center items-center space-x-2"
            >
              <div
                class="w-3 h-3 rounded-full bg-dang-primary animate-bounce"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-dang-primary animate-bounce"
                style="animation-delay: 0.2s"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-dang-primary animate-bounce"
                style="animation-delay: 0.4s"
              ></div>
            </div>
            <p v-else class="text-dang-secondary">
              스크롤하여 더 불러오는 중...
            </p>
          </div>

          <!-- 더 이상 데이터가 없을 때 표시 -->
          <div
            v-if="
              !hasMoreData &&
              visibleDiaries.length > 0 &&
              visibleDiaries.length === filteredDiaries.length
            "
            class="mt-8 text-center py-4 border-t border-dang-light"
          >
            <p class="text-dang-secondary">더 이상 표시할 일기가 없습니다.</p>
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
    <div
      class="absolute bottom-5 left-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 -rotate-15 animate-bounce-custom"
    ></div>
    <div
      class="absolute bottom-5 right-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 rotate-15 animate-bounce-delay-2"
    ></div>
    <div
      class="absolute top-10 right-10 w-[2.5rem] h-[2.5rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 rotate-45 animate-bounce-delay-3"
    ></div>
    <div
      class="absolute top-20 left-20 w-[2rem] h-[2rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 -rotate-30 animate-bounce-delay-4"
    ></div>
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
