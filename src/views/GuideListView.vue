<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Pencil, ChevronRight, Search, ChevronLeft } from 'lucide-vue-next'
import { useGuideStore } from '@/stores/guideStore'
import { Guide } from '@/apis/guide'

const guideStore = useGuideStore()

onMounted(() => {
  guideStore.loadGuides()
})

const guides = computed(() => guideStore.guides)
const isLoading = computed(() => guideStore.isLoading)
const error = computed(() => guideStore.error)
const selectedGuide = computed(() => {
  return guideStore.selectedGuide
})
const showDetailView = ref(false)

const searchQuery = ref('')
const selectedType = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5

const filteredGuides = computed(() => {
  return guides.value.filter((guide) => {
    const matchesSearch = guide.petName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value
      ? guide.guideType === selectedType.value
      : true
    return matchesSearch && matchesType
  })
})

const paginatedGuides = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredGuides.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(filteredGuides.value.length / itemsPerPage)
})

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const resetPagination = () => {
  currentPage.value = 1
}

watch([searchQuery, selectedType], () => {
  resetPagination()
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const viewGuideDetails = async (guide: Guide) => {
  try {
    await guideStore.loadGuideById(guide.guideId)

    if (guideStore.selectedGuide) {
      guideStore.selectedGuide = {
        ...guideStore.selectedGuide, // 기존 데이터 유지
        petName: guide.petName, // petName 추가
      }
    }

    showDetailView.value = true
  } catch (error) {
    console.error('Failed to load guide details:', error)
  }
}

const backToList = () => {
  showDetailView.value = false
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = null
  resetPagination()
}

const guideTypeMap: Record<string, string> = {
  HOSPITAL: '병원',
  SITTER: '돌보미',
  KINDERGARTEN: '유치원',
  NONE: '기본',
}
</script>

<template>
  <div class="bg-dang-pending min-h-screen py-12">
    <div class="bg-white rounded-xl shadow-dang-md p-6 max-w-4xl mx-auto my-6">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-_gray-500">가이드를 불러오는 중입니다...</p>
      </div>

      <!-- Error state -->
      <div v-if="error" class="text-center py-8">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <!-- List View -->
      <div v-if="!isLoading && !error && !showDetailView">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-dang-primary">
            반려동물 가이드 목록
          </h2>
        </div>

        <!-- Search and filters -->
        <div class="mb-6 space-y-4">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-_gray-400 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="가이드 검색..."
              class="w-full pl-10 pr-4 py-2 border border-_gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chart-category3"
            />
          </div>

          <div class="flex flex-wrap gap-3">
            <!-- Type filter -->
            <div class="relative">
              <select
                v-model="selectedType"
                class="appearance-none pl-4 pr-10 py-2 border border-_gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chart-category3 bg-white"
              >
                <option :value="null">모든 가이드 유형</option>
                <option value="NONE">기본</option>
                <option value="SITTER">돌보미</option>
                <option value="HOSPITAL">병원</option>
                <option value="KINDERGARTEN">유치원</option>
              </select>
              <ChevronRight
                class="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-_gray-400 w-4 h-4"
              />
            </div>

            <!-- Reset filters -->
            <button
              @click="resetFilters"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-_gray-300 rounded-lg hover:bg-_gray-50 transition-colors"
            >
              <!-- <Filter class="w-4 h-4" /> -->
              <span class="flex-1 text-center">⟲ 필터 초기화</span>
            </button>
          </div>
        </div>

        <!-- Guides list -->
        <div class="space-y-4">
          <div v-if="filteredGuides.length === 0" class="text-center py-8">
            <p class="text-_gray-500">검색 결과가 없습니다.</p>
          </div>

          <div
            v-for="guide in paginatedGuides"
            :key="guide.guideId"
            @click="viewGuideDetails(guide)"
            class="border border-_gray-200 rounded-lg p-4 hover:border-chart-category3 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="inline-block px-2 py-1 bg-chart-category3 bg-opacity-20 text-chart-category3 text-sm font-medium rounded"
                  >
                    {{ guideTypeMap[guide.guideType] || '알 수 없음' }}
                  </span>
                  <h3 class="text-lg font-semibold text-_gray-800">
                    {{ guide.petName }}의 가이드
                  </h3>
                </div>
              </div>
              <ChevronRight class="text-_gray-400 w-5 h-5 mt-2" />
            </div>
            <div class="mt-3 text-sm text-_gray-500">
              {{ formatDate(guide.createdDate) }} 생성
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex justify-center items-center mt-8 gap-4"
          >
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-_gray-300 transition-colors"
              :class="[
                currentPage === 1
                  ? 'text-_gray-400 cursor-not-allowed'
                  : 'text-_gray-700 hover:bg-_gray-100',
              ]"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>

            <div class="text-_gray-700">
              {{ currentPage }} / {{ totalPages }}
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-_gray-300 transition-colors"
              :class="[
                currentPage === totalPages
                  ? 'text-_gray-400 cursor-not-allowed'
                  : 'text-_gray-700 hover:bg-_gray-100',
              ]"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Detail View -->
      <div v-else-if="showDetailView">
        <div class="flex items-center mb-6">
          <button
            @click="backToList"
            class="mr-4 p-2 rounded-full hover:bg-_gray-100 transition-colors"
          >
            <ChevronRight class="w-5 h-5 text-_gray-700 transform rotate-180" />
          </button>
          <h2 class="text-2xl font-bold text-_gray-800">가이드 상세보기</h2>
        </div>

        <div v-if="selectedGuide" class="space-y-8 mb-4">
          <!-- Guide header -->
          <div class="text-center mb-6">
            <div
              class="inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4"
            >
              <Pencil class="w-12 h-12 text-chart-category3" />
            </div>
            <h3 class="text-2xl font-bold text-chart-category3">
              {{ selectedGuide.petName }}의 가이드
            </h3>
            <p class="text-lg text-_gray-500 mt-2">
              {{ formatDate(selectedGuide.createdDate) }} 생성
            </p>
          </div>

          <!-- Guide content -->
          <div
            class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20"
          >
            <h4 class="text-xl font-bold text-chart-category3 mb-4">
              가이드 내용
            </h4>
            <p
              class="text-_gray-700 leading-relaxed text-lg whitespace-pre-line"
            >
              {{ selectedGuide.content }}
            </p>
          </div>
        </div>
      </div>

      <!-- Decorative paw prints -->
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
  </div>
</template>
