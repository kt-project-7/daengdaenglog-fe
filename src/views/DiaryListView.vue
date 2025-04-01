<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diaryStore'
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Diary, Mood, Weather } from '@/types/diary'
import DiaryEditModal from '@/components/diary/DiaryEditModal.vue'
import { Edit, Trash2, MoreVertical } from 'lucide-vue-next'

const router = useRouter()
const diaryStore = useDiaryStore()

// 날짜 필터 입력값
const dateFilter = ref({
  start: '',
  end: '',
})

// 날짜 필터 적용값 (적용 버튼 클릭 시에만 업데이트)
const appliedDateFilter = ref({
  start: '',
  end: '',
})

// 날짜 필터 에러 메시지
const dateFilterError = ref('')

// 기분 필터
const selectedMood = ref<Mood | 'all'>('all')

// 정렬 옵션
const sortOption = ref<'newest' | 'oldest'>('newest')

// 무한 스크롤 관련 변수
const itemsPerPage = 5
const currentPage = ref(1)
const isLoading = ref(false)
const hasMoreData = ref(true)
const observer = ref<IntersectionObserver | null>(null)
const loadingTriggerRef = ref<HTMLElement | null>(null)

// 수정 모달 관련 변수
const showEditModal = ref(false)
const currentEditDiary = ref<Diary | null>(null)

// 삭제 확인 모달 관련 변수
const showDeleteConfirm = ref(false)
const diaryToDelete = ref<string | null>(null)

// 드롭다운 메뉴 상태 관리
const openDropdownId = ref<string | null>(null)

// 기분 옵션 배열 추가
const moodOptions: Mood[] = [
  'happy',
  'sad',
  'angry',
  'surprised',
  'hungry',
  'hurt',
  'love',
  'sleepy',
]

// 필터 및 정렬이 적용된 일기 목록
const filteredDiaries = computed(() => {
  // 기본 일기 목록
  let result = [...diaryStore.diaries]

  // 날짜 필터 적용
  if (appliedDateFilter.value.start) {
    const startDate = new Date(appliedDateFilter.value.start)
    result = result.filter((diary) => new Date(diary.date) >= startDate)
  }

  if (appliedDateFilter.value.end) {
    const endDate = new Date(appliedDateFilter.value.end)
    // 종료일 포함을 위해 endDate를 하루 뒤로 설정
    endDate.setDate(endDate.getDate() + 1)
    result = result.filter((diary) => new Date(diary.date) < endDate)
  }

  // 기분 필터 적용
  if (selectedMood.value !== 'all') {
    result = result.filter((diary) => diary.mood === selectedMood.value)
  }

  // 정렬 적용
  result.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOption.value === 'newest' ? dateB - dateA : dateA - dateB
  })

  return result
})

// 현재 페이지까지 보여줄 일기 목록 (무한 스크롤용)
const visibleDiaries = computed(() => {
  const endIndex = currentPage.value * itemsPerPage
  return filteredDiaries.value.slice(0, endIndex)
})

// 시작일 변경 시 종료일 최소값 업데이트
const handleStartDateChange = () => {
  // 시작일이 설정되었고, 종료일이 시작일보다 빠른 경우 종료일을 초기화
  if (
    dateFilter.value.start &&
    dateFilter.value.end &&
    new Date(dateFilter.value.end) < new Date(dateFilter.value.start)
  ) {
    dateFilter.value.end = ''
  }
  dateFilterError.value = ''
}

// 날짜 필터 적용
const applyDateFilter = () => {
  // 시작일과 종료일이 모두 설정되었을 때 유효성 검사
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
  resetInfiniteScroll() // 필터 적용 시 무한 스크롤 초기화
}

// 날짜 필터 초기화
const resetDateFilter = () => {
  dateFilter.value.start = ''
  dateFilter.value.end = ''
  appliedDateFilter.value.start = ''
  appliedDateFilter.value.end = ''
  dateFilterError.value = ''
  resetInfiniteScroll()
}

// 기분 필터 변경
const changeMoodFilter = (mood: Mood | 'all') => {
  // 이미 선택된 기분을 다시 클릭하면 전체 보기로 돌아감
  if (selectedMood.value === mood) {
    selectedMood.value = 'all'
  } else {
    selectedMood.value = mood
  }
  resetInfiniteScroll()
}

// 정렬 변경
const changeSortOption = (event: Event) => {
  const select = event.target as HTMLSelectElement
  sortOption.value = select.value as 'newest' | 'oldest'
  resetInfiniteScroll()
}

// 모든 필터 초기화
const resetAllFilters = () => {
  resetDateFilter()
  selectedMood.value = 'all'
  sortOption.value = 'newest'
  resetInfiniteScroll()
}

// 무한 스크롤 초기화
const resetInfiniteScroll = () => {
  currentPage.value = 1
  hasMoreData.value = true
}

// 더 많은 데이터 로드
const loadMoreData = () => {
  if (isLoading.value || !hasMoreData.value) return

  isLoading.value = true

  // 데이터 로드 시뮬레이션 (실제로는 API 호출 등이 있을 수 있음)
  setTimeout(() => {
    const totalItems = filteredDiaries.value.length
    const loadedItems = currentPage.value * itemsPerPage

    if (loadedItems >= totalItems) {
      hasMoreData.value = false
    } else {
      currentPage.value++
    }

    isLoading.value = false
  }, 500)
}

// 무한 스크롤 관찰자 설정
const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value && hasMoreData.value) {
        loadMoreData()
      }
    },
    { threshold: 0.5 },
  )

  if (loadingTriggerRef.value) {
    observer.value.observe(loadingTriggerRef.value)
  }
}

// 일기 상세보기로 이동
const viewDiary = (id: string) => {
  router.push(`/diary/${id}`)
}

// 새 일기 작성 페이지로 이동
const goToWrite = () => {
  router.push('/diary-write')
}

// 일기 데이터 로드
const loadDiaryData = async () => {
  try {
    await diaryStore.fetchDiaries()
    setupIntersectionObserver()
  } catch (error) {
    console.error('일기 목록 로딩 실패:', error)
  }
}

// 일기 수정 모달 열기
const openEditModal = (diary: Diary) => {
  currentEditDiary.value = diary
  showEditModal.value = true
  closeDropdown()
}

// 일기 수정 저장
const saveDiaryEdit = (updatedDiary: Diary) => {
  diaryStore.updateDiary(updatedDiary)
  showEditModal.value = false
  currentEditDiary.value = null
}

// 일기 삭제 확인 모달 열기
const confirmDelete = (id: string) => {
  diaryToDelete.value = id
  showDeleteConfirm.value = true
  closeDropdown()
}

// 일기 삭제 실행
const deleteDiary = () => {
  if (diaryToDelete.value) {
    diaryStore.deleteDiary(diaryToDelete.value)
    showDeleteConfirm.value = false
    diaryToDelete.value = null
  }
}

// 드롭다운 메뉴 토글
const toggleDropdown = (id: string, event: Event) => {
  event.stopPropagation()
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  } else {
    openDropdownId.value = id
  }
}

// 드롭다운 메뉴 닫기
const closeDropdown = () => {
  openDropdownId.value = null
}

// 외부 클릭 시 드롭다운 닫기
const handleOutsideClick = (event: MouseEvent) => {
  if (openDropdownId.value !== null) {
    const target = event.target as HTMLElement
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-trigger')
    ) {
      openDropdownId.value = null
    }
  }
}

onMounted(async () => {
  await loadDiaryData()
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  if (observer.value && loadingTriggerRef.value) {
    observer.value.unobserve(loadingTriggerRef.value)
    observer.value.disconnect()
  }
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div
    class="min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]"
  >
    <!-- 기존 헤더는 제거하고 컨텐츠만 유지 -->
    <main class="container mx-auto px-4 py-8" style="max-width: 1280px">
      <!-- 일기 목록 페이지 - 매거진 스타일 -->
      <div>
        <!-- 타이틀 섹션 - 중앙 정렬 및 강조 -->
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

        <div
          v-if="diaryStore.diaries.length === 0"
          class="text-center py-16 bg-dang-background rounded-xl shadow-dang-sm"
        >
          <div class="mb-6">
            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2370&auto=format&fit=crop"
              alt="강아지"
              class="w-48 h-48 object-cover rounded-full mx-auto opacity-50"
            />
          </div>
          <p class="text-xl text-_black mb-4">아직 작성된 일기가 없어요!</p>
          <p class="text-dang-secondary mb-6">댕댕이의 일상을 기록해보세요.</p>
          <button
            @click="goToWrite"
            class="inline-block bg-dang-primary text-white px-6 py-3 rounded-lg hover:bg-dang-secondary transition-colors shadow-dang-md"
          >
            첫 일기 작성하기
          </button>
        </div>

        <div v-else>
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
                  <label class="text-sm text-dang-secondary mr-2"
                    >시작일:</label
                  >
                  <input
                    type="date"
                    v-model="dateFilter.start"
                    @change="handleStartDateChange"
                    class="border border-dang-light rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary"
                  />
                </div>
                <div class="flex items-center">
                  <label class="text-sm text-dang-secondary mr-2"
                    >종료일:</label
                  >
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

          <div
            v-if="filteredDiaries.length === 0"
            class="text-center py-10 bg-dang-background rounded-xl shadow-dang-sm"
          >
            <p class="text-xl text-dang-primary mb-4">검색 결과가 없어요!</p>
            <p class="text-dang-secondary mb-6">
              다른 필터 조건으로 검색해보세요.
            </p>
            <button
              @click="resetAllFilters"
              class="inline-block bg-dang-primary text-white px-6 py-2 rounded-lg hover:bg-dang-secondary transition-colors shadow-dang-md"
            >
              전체 보기
            </button>
          </div>

          <template v-else>
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
                      visibleDiaries[0].imageUrl ||
                      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2376&auto=format&fit=crop'
                    "
                    :alt="`${formatDate(visibleDiaries[0].date)} 일기 이미지`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                          getMoodEmoji(visibleDiaries[0].mood as Mood).split(
                            ' ',
                          )[0]
                        }}</span>
                        {{
                          getMoodEmoji(visibleDiaries[0].mood as Mood).split(
                            ' ',
                          )[1]
                        }}
                      </span>
                      <span
                        class="px-3 py-1 bg-chart-category3/80 rounded-full text-sm backdrop-blur-sm"
                      >
                        {{
                          getWeatherEmoji(visibleDiaries[0].weather as Weather)
                        }}
                      </span>
                    </div>
                    <h2 class="text-2xl font-bold mb-1">
                      {{ formatDate(visibleDiaries[0].date) }}
                    </h2>
                    <p class="line-clamp-2 text-_gray-100">
                      {{ visibleDiaries[0].content }}
                    </p>
                  </div>

                  <div
                    v-if="visibleDiaries[0].memory"
                    class="absolute top-4 right-4 bg-dang-primary/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center"
                  >
                    <span class="mr-1">✨</span>
                    <span>추억</span>
                  </div>

                  <!-- 수정/삭제 드롭다운 -->
                  <div class="absolute top-4 left-4 z-20">
                    <button
                      @click="toggleDropdown(visibleDiaries[0].id, $event)"
                      class="p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger"
                    >
                      <MoreVertical class="w-5 h-5" />
                    </button>

                    <div
                      v-if="openDropdownId === visibleDiaries[0].id"
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
                        @click.stop="confirmDelete(visibleDiaries[0].id)"
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
                    @click="viewDiary(visibleDiaries[0].id)"
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
                      visibleDiaries[1].imageUrl ||
                      'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=2376&auto=format&fit=crop'
                    "
                    :alt="`${formatDate(visibleDiaries[1].date)} 일기 이미지`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                          getMoodEmoji(visibleDiaries[1].mood as Mood).split(
                            ' ',
                          )[0]
                        }}</span>
                        {{
                          getMoodEmoji(visibleDiaries[1].mood as Mood).split(
                            ' ',
                          )[1]
                        }}
                      </span>
                      <span
                        class="px-2 py-1 bg-chart-category3/80 rounded-full text-xs backdrop-blur-sm"
                      >
                        {{
                          getWeatherEmoji(visibleDiaries[1].weather as Weather)
                        }}
                      </span>
                    </div>
                    <h2 class="text-xl font-bold mb-1">
                      {{ formatDate(visibleDiaries[1].date) }}
                    </h2>
                    <p class="line-clamp-2 text-sm text-_gray-100">
                      {{ visibleDiaries[1].content }}
                    </p>
                  </div>

                  <div
                    v-if="visibleDiaries[1].memory"
                    class="absolute top-4 right-4 bg-dang-primary/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center"
                  >
                    <span class="mr-1">✨</span>
                    <span>추억</span>
                  </div>

                  <!-- 수정/삭제 드롭다운 -->
                  <div class="absolute top-4 left-4 z-20">
                    <button
                      @click="toggleDropdown(visibleDiaries[1].id, $event)"
                      class="p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger"
                    >
                      <MoreVertical class="w-5 h-5" />
                    </button>

                    <div
                      v-if="openDropdownId === visibleDiaries[1].id"
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
                        @click.stop="confirmDelete(visibleDiaries[1].id)"
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
                    @click="viewDiary(visibleDiaries[1].id)"
                  ></div>
                </div>
              </div>

              <!-- 나머지 일기들 (작은 카드) -->
              <div
                v-for="diary in visibleDiaries.slice(2)"
                :key="diary.id"
                class="md:col-span-4 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 border border-dang-light relative"
              >
                <div class="flex flex-col h-full">
                  <div
                    v-if="diary.imageUrl"
                    class="h-48 overflow-hidden relative"
                  >
                    <img
                      :src="diary.imageUrl"
                      :alt="`${formatDate(diary.date)} 일기 이미지`"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />

                    <!-- 수정/삭제 드롭다운 -->
                    <div class="absolute top-4 left-4 z-20">
                      <button
                        @click="toggleDropdown(diary.id, $event)"
                        class="p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger"
                      >
                        <MoreVertical class="w-5 h-5" />
                      </button>

                      <div
                        v-if="openDropdownId === diary.id"
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
                          @click.stop="confirmDelete(diary.id)"
                          class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                          <Trash2 class="w-4 h-4" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="p-5 flex-grow flex flex-col relative">
                    <!-- If there's no image, put the dropdown in the content area -->
                    <div
                      v-if="!diary.imageUrl"
                      class="absolute top-4 left-4 z-20"
                    >
                      <button
                        @click="toggleDropdown(diary.id, $event)"
                        class="p-2 bg-dang-light hover:bg-dang-pending rounded-full text-dang-secondary hover:text-dang-primary transition-colors dropdown-trigger"
                      >
                        <MoreVertical class="w-5 h-5" />
                      </button>

                      <div
                        v-if="openDropdownId === diary.id"
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
                          @click.stop="confirmDelete(diary.id)"
                          class="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                          <Trash2 class="w-4 h-4" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>

                    <div class="flex justify-between items-start mb-3">
                      <h3 class="font-bold text-lg text-dang-primary">
                        {{ formatDate(diary.date) }}
                      </h3>
                      <div
                        v-if="diary.memory"
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
                          getMoodEmoji(diary.mood as Mood).split(' ')[0]
                        }}</span>
                        {{ getMoodEmoji(diary.mood as Mood).split(' ')[1] }}
                      </span>
                      <span
                        class="text-xs px-2 py-1 bg-dang-light rounded-full"
                        >{{ getWeatherEmoji(diary.weather as Weather) }}</span
                      >
                      <span
                        v-if="diary.walkTime"
                        class="text-xs px-2 py-1 bg-dang-light rounded-full"
                      >
                        산책: {{ diary.walkTime }}분
                      </span>
                    </div>

                    <p class="text-_black line-clamp-3 mb-3 text-sm flex-grow">
                      {{ diary.content }}
                    </p>

                    <div
                      class="flex justify-between items-center mt-auto pt-2 border-t border-dang-light"
                    >
                      <span
                        v-if="diary.mealTime"
                        class="text-xs text-dang-secondary"
                      >
                        식사: {{ diary.mealTime }}
                      </span>
                      <button
                        @click.stop="viewDiary(diary.id)"
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
                  @click="viewDiary(diary.id)"
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
          </template>
        </div>
      </div>
    </main>

    <!-- 일기 수정 모달 -->
    <DiaryEditModal
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
