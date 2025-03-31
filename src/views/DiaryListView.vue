<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiaryStore } from '@/stores/diaryStore'
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters'
import type { Mood, Weather, Diary } from '@/types/diary'
import LoginModal from '@/components/modals/LoginModal.vue'
import DiaryCard from '@/components/diary/DiaryCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const diaryStore = useDiaryStore()

// 로그인 모달 상태
const showLoginModal = ref(false)

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

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 5

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

// 현재 페이지에 보여줄 일기 목록
const paginatedDiaries = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredDiaries.value.slice(startIndex, endIndex)
})

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(filteredDiaries.value.length / itemsPerPage)
})

// 페이지 변경
const changePage = (page: number) => {
  currentPage.value = page
}

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
  currentPage.value = 1 // 필터 적용 시 첫 페이지로 이동
}

// 날짜 필터 초기화
const resetDateFilter = () => {
  dateFilter.value.start = ''
  dateFilter.value.end = ''
  appliedDateFilter.value.start = ''
  appliedDateFilter.value.end = ''
  dateFilterError.value = ''
  currentPage.value = 1
}

// 기분 필터 변경
const changeMoodFilter = (mood: Mood | 'all') => {
  // 이미 선택된 기분을 다시 클릭하면 전체 보기로 돌아감
  if (selectedMood.value === mood) {
    selectedMood.value = 'all'
  } else {
    selectedMood.value = mood
  }
  currentPage.value = 1
}

// 정렬 변경
const changeSortOption = (event: Event) => {
  const select = event.target as HTMLSelectElement
  sortOption.value = select.value as 'newest' | 'oldest'
  currentPage.value = 1
}

// 모든 필터 초기화
const resetAllFilters = () => {
  resetDateFilter()
  selectedMood.value = 'all'
  sortOption.value = 'newest'
}

// 일기 상세보기로 이동
const viewDiary = (id: string) => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }
  router.push(`/diary/${id}`)
}

// 새 일기 작성 페이지로 이동
const goToWrite = () => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }
  router.push('/write')
}

// 로그인 처리
const handleLogin = (success: boolean) => {
  if (success) {
    authStore.login()
    showLoginModal.value = false
    // 로그인 성공 후 일기 데이터 로드
    loadDiaryData()
  }
}

// 일기 데이터 로드
const loadDiaryData = async () => {
  try {
    await diaryStore.fetchDiaries()
  } catch (error) {
    console.error('일기 목록 로딩 실패:', error)
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  await loadDiaryData()
})
</script>

<template>
  <div class="min-h-screen bg-_gray-100 py-12">
    <!-- 기존 헤더는 제거하고 컨텐츠만 유지 -->
    <main class="container mx-auto px-4 py-8" style="max-width: 1280px">
      <!-- 일기 목록 페이지 - 매거진 스타일 -->
      <div>
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold mb-2 text-_black">
              나의 댕댕이 관찰일기
            </h1>
            <p class="text-_gray-300">소중한 반려견과의 일상을 기록하세요</p>
          </div>

          <button
            @click="goToWrite"
            class="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-80 transition-colors flex items-center shadow-md"
          >
            <span class="mr-1">+</span> 새 일기
          </button>
        </div>

        <div
          v-if="diaryStore.diaries.length === 0"
          class="text-center py-16 bg-white rounded-xl shadow-sm"
        >
          <div class="mb-6">
            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2370&auto=format&fit=crop"
              alt="강아지"
              class="w-48 h-48 object-cover rounded-full mx-auto opacity-50"
            />
          </div>
          <p class="text-xl text-_black mb-4">아직 작성된 일기가 없어요!</p>
          <p class="text-_gray-300 mb-6">댕댕이의 일상을 기록해보세요.</p>
          <button
            @click="goToWrite"
            class="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-80 transition-colors shadow-md"
          >
            첫 일기 작성하기
          </button>
        </div>

        <div v-else>
          <!-- 필터 및 정렬 옵션 -->
          <div class="bg-white p-5 rounded-lg shadow-sm mb-6">
            <!-- 날짜별 검색 -->
            <div class="mb-4">
              <h3 class="text-sm font-medium text-_black mb-2">날짜별 검색</h3>
              <div class="flex flex-wrap gap-3">
                <div class="flex items-center">
                  <label class="text-sm text-_gray-300 mr-2">시작일:</label>
                  <input
                    type="date"
                    v-model="dateFilter.start"
                    @change="handleStartDateChange"
                    class="border border-_gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div class="flex items-center">
                  <label class="text-sm text-_gray-300 mr-2">종료일:</label>
                  <input
                    type="date"
                    v-model="dateFilter.end"
                    :min="dateFilter.start || undefined"
                    class="border border-_gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  @click="applyDateFilter"
                  class="bg-primary bg-opacity-10 text-_black px-3 py-1 rounded-md text-sm hover:bg-opacity-20"
                >
                  적용
                </button>
                <button
                  @click="resetDateFilter"
                  class="bg-_gray-100 text-_gray-400 px-3 py-1 rounded-md text-sm hover:bg-_gray-200"
                >
                  초기화
                </button>
              </div>
              <p v-if="dateFilterError" class="mt-2 text-_red text-xs">
                {{ dateFilterError }}
              </p>
            </div>

            <div
              class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <!-- 기분별 필터 -->
              <div>
                <h3 class="text-sm font-medium text-_black mb-2">
                  기분별 필터
                </h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="changeMoodFilter('all')"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="
                      selectedMood === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-primary bg-opacity-10 text-_black hover:bg-opacity-20'
                    "
                  >
                    전체
                  </button>
                  <button
                    @click="changeMoodFilter('happy')"
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    :class="
                      selectedMood === 'happy'
                        ? 'bg-primary text-white'
                        : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200'
                    "
                  >
                    <span class="mr-1">😊</span> 기쁨
                  </button>
                  <button
                    @click="changeMoodFilter('sad')"
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    :class="
                      selectedMood === 'sad'
                        ? 'bg-primary text-white'
                        : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200'
                    "
                  >
                    <span class="mr-1">😢</span> 슬픔
                  </button>
                  <button
                    @click="changeMoodFilter('angry')"
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    :class="
                      selectedMood === 'angry'
                        ? 'bg-primary text-white'
                        : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200'
                    "
                  >
                    <span class="mr-1">😡</span> 분노
                  </button>
                  <button
                    @click="changeMoodFilter('surprised')"
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    :class="
                      selectedMood === 'surprised'
                        ? 'bg-primary text-white'
                        : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200'
                    "
                  >
                    <span class="mr-1">😲</span> 놀람
                  </button>
                  <button
                    @click="changeMoodFilter('hungry')"
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    :class="
                      selectedMood === 'hungry'
                        ? 'bg-primary text-white'
                        : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200'
                    "
                  >
                    <span class="mr-1">🍴</span> 배고픔
                  </button>
                  <button
                    @click="changeMoodFilter('sleepy')"
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    :class="
                      selectedMood === 'sleepy'
                        ? 'bg-primary text-white'
                        : 'bg-_gray-100 text-_gray-400 hover:bg-_gray-200'
                    "
                  >
                    <span class="mr-1">😴</span> 졸림
                  </button>
                </div>
              </div>

              <!-- 정렬 옵션 -->
              <div class="flex items-center">
                <span class="text-sm text-_gray-300 mr-2">정렬:</span>
                <select
                  @change="changeSortOption"
                  v-model="sortOption"
                  class="bg-_gray-100 border-0 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                </select>
              </div>
            </div>
          </div>

          <div
            v-if="filteredDiaries.length === 0"
            class="text-center py-10 bg-white rounded-xl shadow-sm"
          >
            <p class="text-xl text-_black mb-4">검색 결과가 없어요!</p>
            <p class="text-_gray-300 mb-6">다른 필터 조건으로 검색해보세요.</p>
            <button
              @click="resetAllFilters"
              class="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-80 transition-colors shadow-md"
            >
              전체 보기
            </button>
          </div>

          <template v-else>
            <!-- 매거진 스타일 그리드 -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <!-- 첫 번째 일기 (큰 카드) -->
              <div
                v-if="paginatedDiaries.length > 0"
                class="md:col-span-8 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-duration-300 cursor-pointer group"
                @click="viewDiary(paginatedDiaries[0].id)"
              >
                <div class="relative h-80">
                  <img
                    :src="
                      paginatedDiaries[0].imageUrl ||
                      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2376&auto=format&fit=crop'
                    "
                    :alt="`${formatDate(paginatedDiaries[0].date)} 일기 이미지`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  ></div>
                  <div class="absolute bottom-0 left-0 p-6 text-white">
                    <div class="flex gap-2 mb-2">
                      <span
                        class="px-3 py-1 bg-primary/80 rounded-full text-sm backdrop-blur-sm"
                      >
                        {{ getMoodEmoji(paginatedDiaries[0].mood as Mood) }}
                      </span>
                      <span
                        class="px-3 py-1 bg-_gray-400/80 rounded-full text-sm backdrop-blur-sm"
                      >
                        {{
                          getWeatherEmoji(
                            paginatedDiaries[0].weather as Weather,
                          )
                        }}
                      </span>
                    </div>
                    <h2 class="text-2xl font-bold mb-1">
                      {{ formatDate(paginatedDiaries[0].date) }}
                    </h2>
                    <p class="line-clamp-2 text-_gray-100">
                      {{ paginatedDiaries[0].content }}
                    </p>
                  </div>

                  <div
                    v-if="paginatedDiaries[0].memory"
                    class="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center"
                  >
                    <span class="mr-1">✨</span>
                    <span>추억</span>
                  </div>
                </div>
              </div>

              <!-- 두 번째 일기 (중간 카드) -->
              <div
                v-if="paginatedDiaries.length > 1"
                class="md:col-span-4 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-duration-300 cursor-pointer group"
                @click="viewDiary(paginatedDiaries[1].id)"
              >
                <div class="relative h-80">
                  <img
                    :src="
                      paginatedDiaries[1].imageUrl ||
                      'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=2376&auto=format&fit=crop'
                    "
                    :alt="`${formatDate(paginatedDiaries[1].date)} 일기 이미지`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  ></div>
                  <div class="absolute bottom-0 left-0 p-4 text-white">
                    <div class="flex gap-2 mb-2">
                      <span
                        class="px-2 py-1 bg-primary/80 rounded-full text-xs backdrop-blur-sm"
                      >
                        {{ getMoodEmoji(paginatedDiaries[1].mood as Mood) }}
                      </span>
                      <span
                        class="px-2 py-1 bg-_gray-400/80 rounded-full text-xs backdrop-blur-sm"
                      >
                        {{
                          getWeatherEmoji(
                            paginatedDiaries[1].weather as Weather,
                          )
                        }}
                      </span>
                    </div>
                    <h2 class="text-xl font-bold mb-1">
                      {{ formatDate(paginatedDiaries[1].date) }}
                    </h2>
                    <p class="line-clamp-2 text-sm text-_gray-100">
                      {{ paginatedDiaries[1].content }}
                    </p>
                  </div>

                  <div
                    v-if="paginatedDiaries[1].memory"
                    class="absolute top-4 right-4 bg-primary/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center"
                  >
                    <span class="mr-1">✨</span>
                    <span>추억</span>
                  </div>
                </div>
              </div>

              <!-- 나머지 일기들 (작은 카드) -->
              <div
                v-for="diary in paginatedDiaries.slice(2)"
                :key="diary.id"
                class="md:col-span-4 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-duration-300 cursor-pointer"
                @click="viewDiary(diary.id)"
              >
                <div class="flex flex-col h-full">
                  <div v-if="diary.imageUrl" class="h-48 overflow-hidden">
                    <img
                      :src="diary.imageUrl"
                      :alt="`${formatDate(diary.date)} 일기 이미지`"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div class="p-5 flex-grow flex flex-col">
                    <div class="flex justify-between items-start mb-3">
                      <h3 class="font-bold text-lg text-_black">
                        {{ formatDate(diary.date) }}
                      </h3>
                      <div
                        v-if="diary.memory"
                        class="bg-primary bg-opacity-10 text-_black px-2 py-1 rounded-full text-xs flex items-center"
                      >
                        <span class="mr-1">✨</span>
                        <span>추억</span>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-3">
                      <span
                        class="text-xs px-2 py-1 bg-primary bg-opacity-10 rounded-full"
                        >{{ getMoodEmoji(diary.mood as Mood) }}</span
                      >
                      <span
                        class="text-xs px-2 py-1 bg-_gray-100 rounded-full"
                        >{{ getWeatherEmoji(diary.weather as Weather) }}</span
                      >
                      <span
                        v-if="diary.walkTime"
                        class="text-xs px-2 py-1 bg-_gray-100 rounded-full"
                      >
                        산책: {{ diary.walkTime }}분
                      </span>
                    </div>

                    <p class="text-_black line-clamp-3 mb-3 text-sm flex-grow">
                      {{ diary.content }}
                    </p>

                    <div
                      class="flex justify-between items-center mt-auto pt-2 border-t border-_gray-100"
                    >
                      <span
                        v-if="diary.mealTime"
                        class="text-xs text-_gray-300"
                      >
                        식사: {{ diary.mealTime }}
                      </span>
                      <button class="text-primary text-xs hover:opacity-80">
                        자세히 보기 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 페이지네이션 - 일기가 5개 이상일 때만 표시 -->
            <div
              v-if="filteredDiaries.length >= 5"
              class="mt-10 flex justify-center"
            >
              <nav class="flex items-center space-x-2">
                <button
                  class="w-10 h-10 flex items-center justify-center rounded-full border border-_gray-200 bg-white text-_gray-300 hover:bg-_gray-100"
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                  :class="{
                    'opacity-50 cursor-not-allowed': currentPage === 1,
                  }"
                >
                  &lt;
                </button>

                <template v-for="page in totalPages" :key="page">
                  <button
                    class="w-10 h-10 flex items-center justify-center rounded-full"
                    :class="
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-_gray-200 bg-white text-_black hover:bg-_gray-100'
                    "
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </button>
                </template>

                <button
                  class="w-10 h-10 flex items-center justify-center rounded-full border border-_gray-200 bg-white text-_gray-300 hover:bg-_gray-100"
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                  :class="{
                    'opacity-50 cursor-not-allowed': currentPage === totalPages,
                  }"
                >
                  &gt;
                </button>
              </nav>
            </div>
          </template>
        </div>
      </div>
    </main>

    <!-- 로그인 모달 -->
    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLogin"
    />
  </div>
</template>
