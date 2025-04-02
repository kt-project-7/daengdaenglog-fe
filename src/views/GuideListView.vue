<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Pencil,
  ChevronRight,
  Search,
  Plus,
  Filter,
  ChevronLeft,
} from 'lucide-vue-next'
import type { Profile } from '@/types/profile'

// Define the Guide type
interface Guide {
  id: string
  petId: string
  petName: string
  type: string // '기본', '펫시터', '수의사', '유치원'
  content: string
  createdAt: string
}

// Props
const props = defineProps<{
  pets: Profile[]
}>()

// Sample guides data (in a real app, this would come from an API)
const guides = ref<Guide[]>([
  {
    id: '1',
    petId: '1',
    petName: '초코',
    type: '기본',
    content:
      '초코는 활발하고 사람을 좋아하는 성격입니다. 하루 2번 산책이 필요하며, 간식을 매우 좋아합니다.',
    createdAt: '2023-04-01T09:00:00Z',
  },
  {
    id: '2',
    petId: '1',
    petName: '초코',
    type: '펫시터',
    content:
      '초코는 낯선 사람에게 처음에는 경계심을 보이지만 금방 친해집니다. 배변 패드는 현관 옆에 있으며, 하루 2번 식사를 제공해주세요.',
    createdAt: '2023-04-02T14:30:00Z',
  },
  {
    id: '3',
    petId: '2',
    petName: '몽이',
    type: '수의사',
    content:
      '몽이는 알러지가 있어 특별한 사료만 먹을 수 있습니다. 피부 상태를 주기적으로 확인해주세요.',
    createdAt: '2023-04-03T11:15:00Z',
  },
  {
    id: '4',
    petId: '2',
    petName: '몽이',
    type: '유치원',
    content:
      '몽이는 다른 강아지들과 잘 어울리지만, 큰 강아지를 무서워합니다. 조용한 환경에서 놀게 해주세요.',
    createdAt: '2023-04-04T16:45:00Z',
  },
  {
    id: '5',
    petId: '3',
    petName: '루시',
    type: '기본',
    content:
      '루시는 조용하고 온순한 성격입니다. 혼자 있는 것을 좋아하며, 낯선 사람을 만나면 처음에는 경계합니다.',
    createdAt: '2023-04-05T10:20:00Z',
  },
  {
    id: '6',
    petId: '3',
    petName: '루시',
    type: '수의사',
    content:
      '루시는 귀 감염 병력이 있으니 귀 상태를 주기적으로 확인해주세요. 특별한 약은 필요 없지만 귀가 빨개지면 바로 병원에 방문해야 합니다.',
    createdAt: '2023-04-06T13:15:00Z',
  },
  {
    id: '7',
    petId: '4',
    petName: '콩이',
    type: '펫시터',
    content:
      '콩이는 활발하고 장난기가 많습니다. 장난감을 좋아하며 특히 공 놀이를 좋아합니다. 하루에 최소 1시간 이상 놀아주세요.',
    createdAt: '2023-04-07T09:30:00Z',
  },
  {
    id: '8',
    petId: '4',
    petName: '콩이',
    type: '유치원',
    content:
      '콩이는 다른 강아지들과 잘 어울립니다. 특히 작은 강아지들과 놀기를 좋아하니 비슷한 크기의 강아지들과 함께 놀게 해주세요.',
    createdAt: '2023-04-08T14:00:00Z',
  },
])

// Selected guide for detail view
const selectedGuide = ref<Guide | null>(null)
const showDetailView = ref(false)

// Filter states
const searchQuery = ref('')
const selectedPet = ref<string | null>(null)
const selectedType = ref<string | null>(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

// Computed property for filtered guides
const filteredGuides = computed(() => {
  return guides.value.filter((guide) => {
    // Filter by search query
    const matchesSearch =
      guide.petName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Filter by pet
    const matchesPet = selectedPet.value
      ? guide.petId === selectedPet.value
      : true

    // Filter by type
    const matchesType = selectedType.value
      ? guide.type === selectedType.value
      : true

    return matchesSearch && matchesPet && matchesType
  })
})

// Computed property for paginated guides
const paginatedGuides = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredGuides.value.slice(startIndex, endIndex)
})

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredGuides.value.length / itemsPerPage)
})

// Go to previous page
const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Go to next page
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedPet, selectedType], () => {
  resetPagination()
})

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// View guide details
const viewGuideDetails = (guide: Guide) => {
  selectedGuide.value = guide
  showDetailView.value = true
}

// Go back to list
const backToList = () => {
  showDetailView.value = false
  selectedGuide.value = null
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedPet.value = null
  selectedType.value = null
  resetPagination()
}

// Create new guide
const createNewGuide = () => {
  // This would navigate to guide creation page or open a modal
  console.log('Create new guide')
}
</script>

<template>
  <!-- 전체 배경을 설정하는 최상위 div -->
  <div class="bg-dang-pending min-h-screen">
    <div class="bg-white rounded-xl shadow-dang-md p-6 max-w-4xl mx-auto">
      <!-- List View -->
      <div v-if="!showDetailView">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-_gray-800">
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
            <!-- Pet filter -->
            <div class="relative">
              <select
                v-model="selectedPet"
                class="appearance-none pl-4 pr-10 py-2 border border-_gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chart-category3 bg-white"
              >
                <option :value="null">모든 반려동물</option>
                <option v-for="pet in props.pets" :key="pet.id" :value="pet.id">
                  {{ pet.name }}
                </option>
              </select>
              <ChevronRight
                class="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-_gray-400 w-4 h-4"
              />
            </div>

            <!-- Type filter -->
            <div class="relative">
              <select
                v-model="selectedType"
                class="appearance-none pl-4 pr-10 py-2 border border-_gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chart-category3 bg-white"
              >
                <option :value="null">모든 가이드 유형</option>
                <option value="기본">기본</option>
                <option value="펫시터">펫시터</option>
                <option value="수의사">수의사</option>
                <option value="유치원">유치원</option>
              </select>
              <ChevronRight
                class="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-_gray-400 w-4 h-4"
              />
            </div>

            <!-- Reset filters -->
            <button
              @click="resetFilters"
              class="inline-flex items-center gap-2 px-4 py-2 border border-_gray-300 rounded-lg hover:bg-_gray-50 transition-colors"
            >
              <Filter class="w-4 h-4" />
              필터 초기화
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
            :key="guide.id"
            @click="viewGuideDetails(guide)"
            class="border border-_gray-200 rounded-lg p-4 hover:border-chart-category3 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="inline-block px-2 py-1 bg-chart-category3 bg-opacity-20 text-chart-category3 text-sm font-medium rounded"
                  >
                    {{ guide.type }}
                  </span>
                  <h3 class="text-lg font-semibold text-_gray-800">
                    {{ guide.petName }}의 가이드
                  </h3>
                </div>
                <p class="text-_gray-600 line-clamp-2">{{ guide.content }}</p>
              </div>
              <ChevronRight class="text-_gray-400 w-5 h-5 mt-2" />
            </div>
            <div class="mt-3 text-sm text-_gray-500">
              {{ formatDate(guide.createdAt) }} 생성
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
      <div v-else>
        <div class="flex items-center mb-6">
          <button
            @click="backToList"
            class="mr-4 p-2 rounded-full hover:bg-_gray-100 transition-colors"
          >
            <ChevronRight class="w-5 h-5 text-_gray-700 transform rotate-180" />
          </button>
          <h2 class="text-2xl font-bold text-_gray-800">가이드 상세보기</h2>
        </div>

        <div v-if="selectedGuide" class="space-y-8">
          <!-- Guide header -->
          <div class="text-center mb-6">
            <div
              class="inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4"
            >
              <Pencil class="w-12 h-12 text-chart-category3" />
            </div>
            <h3 class="text-2xl font-bold text-chart-category3">
              {{ selectedGuide.petName }}의 {{ selectedGuide.type }} 가이드
            </h3>
            <p class="text-lg text-_gray-500 mt-2">
              {{ formatDate(selectedGuide.createdAt) }} 생성
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

          <!-- Additional sections could be added here based on guide type -->
          <div
            v-if="selectedGuide.type === '펫시터'"
            class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20"
          >
            <h4 class="text-xl font-bold text-chart-category3 mb-4">
              펫시터 특별 지침
            </h4>
            <div class="text-_gray-700 leading-relaxed text-lg space-y-4">
              <div class="flex items-start gap-2">
                <span class="font-semibold min-w-[100px]">식사:</span>
                <p>하루 2회 (아침 8시, 저녁 6시)</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-semibold min-w-[100px]">산책:</span>
                <p>하루 2회 (오전, 오후) 각 30분씩</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-semibold min-w-[100px]">약물:</span>
                <p>없음</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
