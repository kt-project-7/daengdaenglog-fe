<template>
    <div class="min-h-screen bg-dang-light overflow-y-auto overflow-x-hidden scroll-smooth" @scroll="handleScroll" ref="chartContainer">
      <!-- 헤더 섹션 -->
      <header class="fixed top-0 left-0 w-full flex justify-between items-center p-4 md:px-8 bg-dang-light/90 backdrop-blur-sm z-50 shadow-dang-sm">
        <div class="flex items-center gap-2">
          <button class="bg-transparent border-none cursor-pointer flex items-center justify-center p-2" @click="toggleMenu">
            <Menu class="w-6 h-6 text-dang-primary" />
          </button>
          <img src="../assets/title2.svg" alt="댕댕로그" class="h-8 w-auto" />
        </div>
        <div class="flex gap-4">
          <button
            v-if="!isLoggedIn"
            @click="showLoginModal = true"
            class="bg-dang-primary text-white border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:bg-dang-secondary hover:-translate-y-0.5"
          >
            로그인
          </button>
          <template v-else>
            <button @click="$emit('navigate', 'diary-list')" class="bg-dang-primary text-white border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:bg-dang-secondary hover:-translate-y-0.5">
              일기장
            </button>
            <button @click="$emit('navigate', 'profile')" class="bg-dang-primary text-white border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:bg-dang-secondary hover:-translate-y-0.5">
              프로필
            </button>
          </template>
        </div>
      </header>
  
      <!-- 사이드 메뉴 -->
      <div class="fixed top-0 left-0 w-[300px] h-screen bg-white z-[2000] shadow-dang-md p-8 transition-all duration-300" :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'">
        <button class="absolute top-4 right-4 bg-transparent border-none cursor-pointer flex items-center justify-center" @click="toggleMenu">
          <X class="w-6 h-6 text-dang-primary" />
        </button>
        <div class="mt-8 flex flex-col gap-4">
          <button @click="navigateAndCloseMenu('diary-write')" class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-dang-light hover:text-dang-primary">
            🐾일기 작성
          </button>
          <button @click="navigateAndCloseMenu('diary-list')" class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-dang-light hover:text-dang-primary">
            🐾일기 보기
          </button>
          <button @click="navigateAndCloseMenu('dang-money-chart')" class="bg-transparent border-none text-left text-lg py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-dang-light hover:text-dang-primary">
            🐾댕머니차트
          </button>
        </div>
      </div>
  
      <!-- 로그인 모달 -->
      <div
        v-if="showLoginModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[3000]"
        @click.self="showLoginModal = false"
      >
        <div class="bg-white rounded-2xl p-8 w-[90%] max-w-[400px] relative">
          <button class="absolute top-4 right-4 bg-transparent border-none cursor-pointer" @click="showLoginModal = false">
            <X class="w-6 h-6 text-dang-primary" />
          </button>
          <h2 class="text-2xl text-dang-primary mb-6 text-center font-bold">로그인</h2>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <label for="phone" class="font-bold text-_gray-400">전화번호</label>
              <input
                type="tel"
                id="phone"
                v-model="phoneNumber"
                placeholder="전화번호를 입력하세요"
                class="p-3 border border-_gray-200 rounded-lg text-base"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="password" class="font-bold text-_gray-400">비밀번호</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="비밀번호를 입력하세요"
                class="p-3 border border-_gray-200 rounded-lg text-base"
              />
            </div>
            <button 
              @click="login" 
              class="bg-dang-primary text-white border-none py-3 rounded-lg font-bold cursor-pointer transition-all duration-300 hover:bg-dang-secondary mt-4"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
  
      <!-- 메인 히어로 섹션 -->
      <section class="relative h-[50vh] flex items-center justify-center overflow-hidden pt-[60px]">
        <div
          class="absolute w-full h-full top-0 left-0 z-[1]"
          :style="{ transform: `translateY(${scrollY * 0.1}px)` }"
        >
          <div class="absolute w-[600px] h-[600px] rounded-full bg-dang-primary opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
  
        <div
          class="absolute w-full h-full top-0 left-0 z-[5] flex items-center justify-center"
          :style="{ transform: `translateY(${scrollY * -0.2}px)` }"
        >
          <div class="text-center p-8 max-w-[800px] relative z-10">
            <h1 class="text-4xl md:text-5xl text-dang-primary mb-4 font-bold">댕머니차트</h1>
            <p class="text-lg md:text-xl text-_gray-400 mb-8">
              반려견의 의료비와 지출 내역을 한눈에 확인하세요
            </p>
            <div class="flex flex-col md:flex-row justify-around gap-4 md:gap-8 mt-8">
              <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-dang-md transition-transform duration-300 hover:-translate-y-1 flex-1">
                <DollarSign class="w-10 h-10 text-dang-primary" />
                <div class="flex flex-col">
                  <h3 class="text-base text-_gray-400 mb-2">총 지출</h3>
                  <p class="text-xl font-bold text-dang-primary">{{ formatCurrency(totalExpense) }}</p>
                </div>
              </div>
              <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-dang-md transition-transform duration-300 hover:-translate-y-1 flex-1">
                <FileText class="w-10 h-10 text-dang-primary" />
                <div class="flex flex-col">
                  <h3 class="text-base text-_gray-400 mb-2">청구 건수</h3>
                  <p class="text-xl font-bold text-dang-primary">{{ claimCount }}건</p>
                </div>
              </div>
              <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-dang-md transition-transform duration-300 hover:-translate-y-1 flex-1">
                <TrendingUp class="w-10 h-10 text-dang-primary" />
                <div class="flex flex-col">
                  <h3 class="text-base text-_gray-400 mb-2">환급률</h3>
                  <p class="text-xl font-bold text-dang-primary">{{ refundRate }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Dog image with bouncing animation -->
        <div
          class="absolute w-full h-full top-0 left-0 z-[3]"
          :style="{
            transform: `translateY(${scrollY * -0.15}px) translateX(${scrollY * 0.05}px)`,
          }"
        >
          <img
            src="../assets/dog2.svg"
            alt="강아지 일러스트"
            class="absolute w-[150px] md:w-[75px] h-auto bottom-[10%] right-[10%]"
          />
        </div>
  
        <!-- Paw prints with bouncing animation -->
        <div
          class="absolute w-full h-full top-0 left-0 z-[2]"
          :style="{
            transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * 0.05}deg)`,
          }"
        >
          <img
            src="../assets/paw1.svg"
            alt="발자국"
            class="absolute w-[100px] h-auto top-[30%] left-[20%] -rotate-[15deg] animate-bounce-delay-1"
            :class="{ 'animate-bounce-custom': isAnimating }"
          />
        </div>
  
        <div
          class="absolute w-full h-full top-0 left-0 z-[2]"
          :style="{
            transform: `translateY(${scrollY * -0.25}px) translateX(${scrollY * -0.1}px) rotate(${scrollY * -0.03}deg)`,
          }"
        >
          <img
            src="../assets/paw1.svg"
            alt="발자국"
            class="absolute w-[100px] h-auto bottom-[25%] left-[15%] rotate-[20deg] animate-bounce-delay-2"
            :class="{ 'animate-bounce-delay-1': isAnimating }"
          />
        </div>
      </section>
  
      <!-- 차트 섹션 -->
      <section class="relative py-16 px-8 bg-white z-10">
        <div class="text-center mb-12">
          <h2 class="text-4xl text-dang-primary font-bold">지출 분석</h2>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          <!-- 월별 지출 차트 -->
          <div class="bg-dang-light rounded-[20px] p-8 shadow-dang-md transition-all duration-300 hover:-translate-y-1 hover:shadow-dang-lg">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl text-dang-primary font-bold">월별 지출 내역</h3>
              <div class="flex gap-2">
                <button 
                  @click="changeChartPeriod('month')" 
                  :class="[
                    'py-2 px-4 rounded-full text-sm transition-all duration-200',
                    chartPeriod === 'month' 
                      ? 'bg-dang-primary text-white' 
                      : 'bg-_gray-100 text-_gray-400'
                  ]"
                >
                  월별
                </button>
                <button 
                  @click="changeChartPeriod('year')" 
                  :class="[
                    'py-2 px-4 rounded-full text-sm transition-all duration-200',
                    chartPeriod === 'year' 
                      ? 'bg-dang-primary text-white' 
                      : 'bg-_gray-100 text-_gray-400'
                  ]"
                >
                  연도별
                </button>
              </div>
            </div>
            <div class="h-[300px] relative">
              <canvas ref="monthlyExpenseChart"></canvas>
            </div>
          </div>
  
          <!-- 카테고리별 지출 차트 -->
          <div class="bg-dang-light rounded-[20px] p-8 shadow-dang-md transition-all duration-300 hover:-translate-y-1 hover:shadow-dang-lg">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl text-dang-primary font-bold">카테고리별 지출</h3>
            </div>
            <div class="h-[300px] relative">
              <canvas ref="categoryExpenseChart"></canvas>
            </div>
            <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="(category, index) in expenseCategories" 
                :key="index" 
                class="flex items-center gap-2"
              >
                <div 
                  class="w-3 h-3 rounded-full" 
                  :style="{ backgroundColor: categoryColors[index] }"
                ></div>
                <div class="flex flex-col">
                  <span class="text-sm text-_gray-400">{{ category.name }}</span>
                  <span class="text-xs font-bold text-dang-primary">{{ formatCurrency(category.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 보험 청구 내역 섹션 -->
      <section class="relative py-16 px-8 bg-dang-light z-10">
        <div class="text-center mb-12">
          <h2 class="text-4xl text-dang-primary font-bold">보험 청구 내역</h2>
        </div>
  
        <div class="flex max-w-[1200px] w-full mx-auto bg-transparent relative z-5">
          <div class="w-[30px] bg-[#e0a458] rounded-l-[10px] flex flex-col justify-around items-center py-5">
            <div 
              v-for="n in 8" 
              :key="n" 
              class="w-[15px] h-[15px] bg-dang-light rounded-full my-[5px] shadow-inner"
            ></div>
          </div>
          
          <div class="flex-1 bg-dang-background rounded-r-[10px] p-8 shadow-dang-md relative bg-grid">
            <div class="flex flex-wrap gap-4 mb-8 items-center">
              <div class="flex flex-col gap-2">
                <label for="status-filter" class="text-sm text-_gray-400 font-bold">상태</label>
                <select 
                  id="status-filter" 
                  v-model="statusFilter" 
                  class="py-2 px-4 border border-_gray-200 rounded-lg bg-white min-w-[120px]"
                >
                  <option value="all">전체</option>
                  <option value="pending">처리중</option>
                  <option value="approved">승인</option>
                  <option value="rejected">거절</option>
                </select>
              </div>
              
              <div class="flex flex-col gap-2">
                <label for="date-filter" class="text-sm text-_gray-400 font-bold">기간</label>
                <select 
                  id="date-filter" 
                  v-model="dateFilter" 
                  class="py-2 px-4 border border-_gray-200 rounded-lg bg-white min-w-[120px]"
                >
                  <option value="all">전체</option>
                  <option value="1month">1개월</option>
                  <option value="3months">3개월</option>
                  <option value="6months">6개월</option>
                  <option value="1year">1년</option>
                </select>
              </div>
              
              <button 
                @click="resetFilters" 
                class="flex items-center gap-2 bg-_gray-100 border-none py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-_gray-200 ml-auto self-end"
              >
                <RefreshCw class="w-4 h-4" />
                초기화
              </button>
            </div>
            
            <div class="mb-8">
              <div v-if="filteredClaims.length === 0" class="flex flex-col items-center justify-center p-12 bg-white rounded-[10px] shadow-sm">
                <FileQuestion class="w-16 h-16 text-_gray-200 mb-4" />
                <p class="text-_gray-300 text-lg">보험 청구 내역이 없습니다.</p>
              </div>
              
              <div v-else class="overflow-x-auto rounded-[10px] shadow-sm">
                <table class="w-full border-collapse bg-white">
                  <thead>
                    <tr>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">날짜</th>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">병원명</th>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">진료내용</th>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">청구금액</th>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">환급금액</th>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">상태</th>
                      <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="claim in paginatedClaims" 
                      :key="claim.id" 
                      :class="{ 'bg-dang-rejected': claim.status === 'rejected' }"
                      class="border-b border-_gray-100 hover:bg-_gray-100"
                    >
                      <td class="p-4">{{ formatDate(claim.date) }}</td>
                      <td class="p-4">{{ claim.hospital }}</td>
                      <td class="p-4">{{ claim.description }}</td>
                      <td class="p-4">{{ formatCurrency(claim.claimAmount) }}</td>
                      <td class="p-4">{{ formatCurrency(claim.refundAmount) }}</td>
                      <td class="p-4">
                        <span 
                          class="inline-block py-1 px-2 rounded-full text-xs font-bold"
                          :class="getStatusClass(claim.status)"
                        >
                          {{ getStatusText(claim.status) }}
                        </span>
                      </td>
                      <td class="p-4">
                        <button 
                          @click="viewClaimDetail(claim)" 
                          class="bg-transparent border-none cursor-pointer text-_gray-400 transition-colors duration-200 hover:text-dang-primary"
                        >
                          <Eye class="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="flex justify-center items-center gap-4 mt-8">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="bg-transparent border-none cursor-pointer text-_gray-400 transition-colors duration-200 disabled:text-_gray-200 disabled:cursor-not-allowed hover:text-dang-primary"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <span class="text-sm text-_gray-400">{{ currentPage }} / {{ totalPages }}</span>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="bg-transparent border-none cursor-pointer text-_gray-400 transition-colors duration-200 disabled:text-_gray-200 disabled:cursor-not-allowed hover:text-dang-primary"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 청구 상세 모달 -->
      <div v-if="showClaimDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[3000]" @click.self="closeClaimDetailModal">
        <div class="bg-white rounded-2xl w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto relative">
          <button 
            @click="closeClaimDetailModal" 
            class="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
          >
            <X class="w-6 h-6 text-dang-primary" />
          </button>
          
          <h2 class="text-2xl text-dang-primary p-6 border-b border-_gray-100 m-0">청구 상세 정보</h2>
          
          <div class="p-6" v-if="selectedClaim">
            <div class="flex justify-between items-center mb-6">
              <span 
                class="inline-block py-2 px-4 rounded-full text-sm font-bold"
                :class="getStatusClass(selectedClaim.status)"
              >
                {{ getStatusText(selectedClaim.status) }}
              </span>
              <div class="text-sm text-_gray-300">
                {{ formatDate(selectedClaim.date) }}
              </div>
            </div>
            
            <div class="bg-_gray-100 rounded-[10px] p-6 mb-6">
              <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
                <span class="font-bold text-_gray-400">병원명</span>
                <span class="text-_black">{{ selectedClaim.hospital }}</span>
              </div>
              <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
                <span class="font-bold text-_gray-400">진료내용</span>
                <span class="text-_black">{{ selectedClaim.description }}</span>
              </div>
              <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
                <span class="font-bold text-_gray-400">진료비</span>
                <span class="text-_black">{{ formatCurrency(selectedClaim.medicalFee) }}</span>
              </div>
              <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
                <span class="font-bold text-_gray-400">청구금액</span>
                <span class="text-_black">{{ formatCurrency(selectedClaim.claimAmount) }}</span>
              </div>
              <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
                <span class="font-bold text-_gray-400">환급금액</span>
                <span class="text-_black">{{ formatCurrency(selectedClaim.refundAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-bold text-_gray-400">환급률</span>
                <span class="text-_black">{{ calculateRefundRate(selectedClaim) }}%</span>
              </div>
            </div>
            
            <div class="mb-6">
              <h3 class="text-lg text-_gray-400 mb-4">첨부 서류</h3>
              <div class="flex flex-col gap-3">
                <div 
                  v-for="(doc, index) in selectedClaim.documents" 
                  :key="index" 
                  class="flex items-center gap-3 bg-_gray-100 p-3 rounded-lg"
                >
                  <FileText class="w-5 h-5 text-_gray-400" />
                  <span class="flex-1 text-sm text-_gray-400">{{ doc.name }}</span>
                  <button class="bg-transparent border-none cursor-pointer text-dang-primary transition-colors duration-200 hover:text-dang-secondary">
                    <Download class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="selectedClaim.notes" class="bg-dang-pending rounded-[10px] p-6 mb-6">
              <h3 class="text-lg text-dang-pending-text mb-3">특이사항</h3>
              <p class="text-dang-pending-text text-sm leading-6">{{ selectedClaim.notes }}</p>
            </div>
          </div>
          
          <div class="flex justify-end p-6 border-t border-_gray-100">
            <button 
              @click="closeClaimDetailModal" 
              class="bg-_gray-100 text-_gray-400 border-none py-3 px-6 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-_gray-200"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
  
      <!-- 푸터 -->
      <footer class="bg-dang-primary text-white text-center py-8 z-10 relative">
        <p>© 2025 댕댕로그 - 반려견을 위한 최고의 일기장</p>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { 
    Menu, X, DollarSign, FileText, TrendingUp, RefreshCw, 
    FileQuestion, Eye, ChevronLeft, ChevronRight, Download 
  } from 'lucide-vue-next'
  import Chart from 'chart.js/auto'
  
  // 상태 관리
  const chartContainer = ref<HTMLElement | null>(null)
  const scrollY = ref(0)
  const isAnimating = ref(true)
  const isMenuOpen = ref(false)
  const showLoginModal = ref(false)
  const isLoggedIn = ref(true) // 로그인 상태 가정
  const phoneNumber = ref('')
  const password = ref('')
  
  // 차트 관련 상태
  const monthlyExpenseChart = ref<HTMLCanvasElement | null>(null)
  const categoryExpenseChart = ref<HTMLCanvasElement | null>(null)
  const chartPeriod = ref('month')
  let monthlyChart: Chart | null = null
  let categoryChart: Chart | null = null
  
  // 청구 내역 관련 상태
  const statusFilter = ref('all')
  const dateFilter = ref('all')
  const currentPage = ref(1)
  const itemsPerPage = 5
  const showClaimDetailModal = ref(false)
  const selectedClaim = ref<any>(null)
  
  // 요약 데이터
  const totalExpense = ref(2850000)
  const claimCount = ref(12)
  const refundRate = ref(65)
  
  // 월별 지출 데이터
  const monthlyExpenseData = ref([
    { month: '1월', amount: 150000 },
    { month: '2월', amount: 220000 },
    { month: '3월', amount: 180000 },
    { month: '4월', amount: 320000 },
    { month: '5월', amount: 250000 },
    { month: '6월', amount: 190000 },
    { month: '7월', amount: 280000 },
    { month: '8월', amount: 350000 },
    { month: '9월', amount: 310000 },
    { month: '10월', amount: 230000 },
    { month: '11월', amount: 270000 },
    { month: '12월', amount: 100000 },
  ])
  
  // 카테고리별 지출 데이터
  const expenseCategories = ref([
    { name: '정기검진', amount: 850000 },
    { name: '예방접종', amount: 450000 },
    { name: '질병치료', amount: 950000 },
    { name: '수술', amount: 350000 },
    { name: '약품', amount: 250000 }
  ])
  
  // 카테고리 색상
  const categoryColors = [
    '#f59e0b', // 주 색상
    '#fbbf24',
    '#fcd34d',
    '#fde68a',
    '#fef3c7'
  ]
  
  // 청구 내역 데이터
  const claimData = ref([
    {
      id: 1,
      date: '2025-03-15',
      hospital: '댕댕 동물병원',
      description: '정기검진 및 예방접종',
      medicalFee: 150000,
      claimAmount: 120000,
      refundAmount: 80000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ],
      notes: '정기검진 결과 모두 건강합니다.'
    },
    {
      id: 2,
      date: '2025-02-28',
      hospital: '멍멍 동물메디컬센터',
      description: '피부질환 치료',
      medicalFee: 220000,
      claimAmount: 180000,
      refundAmount: 120000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' },
        { name: '처방전.pdf', url: '#' }
      ]
    },
    {
      id: 3,
      date: '2025-02-10',
      hospital: '행복한 동물병원',
      description: '치과 치료',
      medicalFee: 350000,
      claimAmount: 300000,
      refundAmount: 180000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ]
    },
    {
      id: 4,
      date: '2025-01-25',
      hospital: '댕댕 동물병원',
      description: '혈액검사',
      medicalFee: 80000,
      claimAmount: 70000,
      refundAmount: 45000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' },
        { name: '검사결과지.pdf', url: '#' }
      ]
    },
    {
      id: 5,
      date: '2025-01-05',
      hospital: '24시 동물응급센터',
      description: '구토 및 설사 응급치료',
      medicalFee: 180000,
      claimAmount: 150000,
      refundAmount: 90000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ],
      notes: '밤에 갑자기 구토와 설사 증상이 있어 응급실 방문'
    },
    {
      id: 6,
      date: '2024-12-20',
      hospital: '멍멍 동물메디컬센터',
      description: '슬개골 탈구 수술',
      medicalFee: 1200000,
      claimAmount: 1000000,
      refundAmount: 650000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' },
        { name: '수술동의서.pdf', url: '#' }
      ]
    },
    {
      id: 7,
      date: '2024-11-15',
      hospital: '댕댕 동물병원',
      description: '정기검진',
      medicalFee: 100000,
      claimAmount: 80000,
      refundAmount: 50000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ]
    },
    {
      id: 8,
      date: '2024-10-30',
      hospital: '행복한 동물병원',
      description: '알러지 검사',
      medicalFee: 150000,
      claimAmount: 120000,
      refundAmount: 75000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' },
        { name: '검사결과지.pdf', url: '#' }
      ]
    },
    {
      id: 9,
      date: '2024-10-05',
      hospital: '멍멍 동물메디컬센터',
      description: '예방접종',
      medicalFee: 120000,
      claimAmount: 100000,
      refundAmount: 60000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ]
    },
    {
      id: 10,
      date: '2024-09-20',
      hospital: '댕댕 동물병원',
      description: '귀 염증 치료',
      medicalFee: 90000,
      claimAmount: 75000,
      refundAmount: 45000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ]
    },
    {
      id: 11,
      date: '2024-09-05',
      hospital: '24시 동물응급센터',
      description: '이물질 제거 (장난감 삼킴)',
      medicalFee: 250000,
      claimAmount: 200000,
      refundAmount: 120000,
      status: 'approved',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' },
        { name: 'X-ray 사진.pdf', url: '#' }
      ],
      notes: '장난감 조각을 삼켜서 응급 처치 필요'
    },
    {
      id: 12,
      date: '2025-03-20',
      hospital: '멍멍 동물메디컬센터',
      description: '건강검진 패키지',
      medicalFee: 300000,
      claimAmount: 250000,
      refundAmount: 0,
      status: 'pending',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ]
    },
    {
      id: 13,
      date: '2024-08-15',
      hospital: '행복한 동물병원',
      description: '피부 알러지 치료',
      medicalFee: 180000,
      claimAmount: 150000,
      refundAmount: 0,
      status: 'rejected',
      documents: [
        { name: '진료확인서.pdf', url: '#' },
        { name: '영수증.pdf', url: '#' }
      ],
      notes: '보험 적용 대상이 아닌 치료로 판단되어 거절됨'
    }
  ])
  
  // 필터링된 청구 내역
  const filteredClaims = computed(() => {
    let filtered = [...claimData.value]
    
    // 상태 필터링
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter.value)
    }
    
    // 날짜 필터링
    if (dateFilter.value !== 'all') {
      const now = new Date()
      let cutoffDate = new Date()
      
      switch (dateFilter.value) {
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6)
          break
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(claim => new Date(claim.date) >= cutoffDate)
    }
    
    // 정렬 (최신순)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return filtered
  })
  
  // 페이지네이션
  const totalPages = computed(() => {
    return Math.ceil(filteredClaims.value.length / itemsPerPage)
  })
  
  const paginatedClaims = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredClaims.value.slice(start, end)
  })
  
  // 페이지 이동 함수
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  // 필터 초기화
  const resetFilters = () => {
    statusFilter.value = 'all'
    dateFilter.value = 'all'
    currentPage.value = 1
  }
  
  // 청구 상세 보기
  const viewClaimDetail = (claim: any) => {
    selectedClaim.value = claim
    showClaimDetailModal.value = true
  }
  
  const closeClaimDetailModal = () => {
    showClaimDetailModal.value = false
    selectedClaim.value = null
  }
  
  // 상태 텍스트 및 클래스
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '처리중'
      case 'approved': return '승인'
      case 'rejected': return '거절'
      default: return ''
    }
  }
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-dang-pending text-dang-pending-text'
      case 'approved': return 'bg-dang-approved text-dang-approved-text'
      case 'rejected': return 'bg-dang-rejected text-dang-rejected-text'
      default: return ''
    }
  }
  
  // 환급률 계산
  const calculateRefundRate = (claim: any) => {
    if (claim.claimAmount === 0) return 0
    return Math.round((claim.refundAmount / claim.claimAmount) * 100)
  }
  
  // 금액 포맷팅
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원'
  }
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }
  
  // 차트 기간 변경
  const changeChartPeriod = (period: string) => {
    chartPeriod.value = period
    updateMonthlyChart()
  }
  
  // 월별 차트 업데이트
  const updateMonthlyChart = () => {
    if (!monthlyChart) return
    
    let labels, data
    
    if (chartPeriod.value === 'month') {
      labels = monthlyExpenseData.value.map(item => item.month)
      data = monthlyExpenseData.value.map(item => item.amount)
    } else {
      // 연도별 데이터 (예시)
      labels = ['2022년', '2023년', '2024년', '2025년']
      data = [1200000, 1500000, 1800000, 2850000]
    }
    
    monthlyChart.data.labels = labels
    monthlyChart.data.datasets[0].data = data
    monthlyChart.update()
  }
  
  // 차트 초기화
  const initCharts = () => {
    // 월별 지출 차트
    if (monthlyExpenseChart.value) {
      const ctx = monthlyExpenseChart.value.getContext('2d')
      if (ctx) {
        monthlyChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: monthlyExpenseData.value.map(item => item.month),
            datasets: [{
              label: '지출 금액',
              data: monthlyExpenseData.value.map(item => item.amount),
              backgroundColor: '#f59e0b',
              borderColor: '#f59e0b',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString() + '원'
                  }
                }
              }
            }
          }
        })
      }
    }
    
    // 카테고리별 지출 차트
    if (categoryExpenseChart.value) {
      const ctx = categoryExpenseChart.value.getContext('2d')
      if (ctx) {
        categoryChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: expenseCategories.value.map(item => item.name),
            datasets: [{
              data: expenseCategories.value.map(item => item.amount),
              backgroundColor: categoryColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number
                    return value.toLocaleString() + '원'
                  }
                }
              }
            }
          }
        })
      }
    }
  }
  
  const handleScroll = () => {
    if (chartContainer.value) {
      scrollY.value = chartContainer.value.scrollTop
    }
  }
  
  // Toggle side menu
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }
  
  // Navigate and close menu
  const navigateAndCloseMenu = (page: string) => {
    emit('navigate', page)
    isMenuOpen.value = false
  }
  
  // Login function
  const login = () => {
    if (phoneNumber.value && password.value) {
      isLoggedIn.value = true
      showLoginModal.value = false
      phoneNumber.value = ''
      password.value = ''
    } else {
      alert('전화번호와 비밀번호를 입력해주세요.')
    }
  }
  
  // Animation interval to toggle bouncing effect
  const startBouncingAnimation = () => {
    setInterval(() => {
      isAnimating.value = true
      setTimeout(() => {
        isAnimating.value = false
      }, 1000)
    }, 3000)
  }
  
  // 컴포넌트가 마운트될 때 이벤트 리스너 등록 및 차트 초기화
  onMounted(() => {
    if (chartContainer.value) {
      chartContainer.value.addEventListener('scroll', handleScroll)
    }
  
    // 바운싱 애니메이션 시작
    startBouncingAnimation()
    
    // 차트 초기화
    initCharts()
  })
  
  // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 및 차트 정리
  onUnmounted(() => {
    if (chartContainer.value) {
      chartContainer.value.removeEventListener('scroll', handleScroll)
    }
    
    // 차트 정리
    if (monthlyChart) {
      monthlyChart.destroy()
    }
    
    if (categoryChart) {
      categoryChart.destroy()
    }
  })
  
  const emit = defineEmits<{
    (
      e: 'navigate',
      page: 'diary-list' | 'profile' | 'diary-write' | 'dang-money-chart',
    ): void
  }>()
  </script>
  
  <style scoped>
  .bg-grid {
    background-image: 
      linear-gradient(#f3f3f3 1px, transparent 1px),
      linear-gradient(90deg, #f3f3f3 1px, transparent 1px);
    background-size: 20px 20px;
  }
  </style>
  
  