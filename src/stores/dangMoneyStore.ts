import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadClaims } from '@/apis/dangMoney'
import type { Claim } from '@/types/claim'

export const useDangMoneyStore = defineStore('dangMoney', () => {
  // 총 지출
  const totalExpense = computed(() => {
    const totalMedicalFee = claims.value.reduce(
      (sum, claim) => sum + claim.medicalFee,
      0,
    )
    const totalRefundAmount = claims.value.reduce(
      (sum, claim) => sum + claim.refundAmount,
      0,
    )

    return totalMedicalFee - totalRefundAmount
  })

  // 보험 청구 건수 (배열 길이)
  const claimCount = computed(() => {
    return claims.value.length
  })

  // 평균 환급률 ((총 환급 금액 / 총 청구 금액) * 100)
  const refundRate = computed(() => {
    const totalClaimAmount = claims.value.reduce(
      (sum, claim) => sum + claim.claimAmount,
      0,
    )
    const totalRefundAmount = claims.value.reduce(
      (sum, claim) => sum + claim.refundAmount,
      0,
    )

    return totalClaimAmount === 0
      ? 0
      : Math.round((totalRefundAmount / totalClaimAmount) * 100)
  })

  // 차트 관련 상태
  const chartPeriod = ref('month')

  // 월별 지출 데이터
  const monthlyExpenseData = computed(() => {
    // 월별 지출을 계산하기 위한 객체
    const monthlyExpense: { [key: string]: number } = {}

    // claims 배열을 순회하면서 각 청구 항목을 월별로 구분
    claims.value.forEach((claim) => {
      const month = new Date(claim.date).getMonth() + 1 // 월은 0부터 시작하므로 1을 더함
      const monthStr = `${month}월`

      // 월별 지출 금액을 합산
      if (monthlyExpense[monthStr]) {
        monthlyExpense[monthStr] += claim.medicalFee
      } else {
        monthlyExpense[monthStr] = claim.medicalFee
      }
    })

    // 결과를 배열로 반환 (12개월에 대한 데이터 생성)
    return [
      { month: '1월', amount: monthlyExpense['1월'] || 0 },
      { month: '2월', amount: monthlyExpense['2월'] || 0 },
      { month: '3월', amount: monthlyExpense['3월'] || 0 },
      { month: '4월', amount: monthlyExpense['4월'] || 0 },
      { month: '5월', amount: monthlyExpense['5월'] || 0 },
      { month: '6월', amount: monthlyExpense['6월'] || 0 },
      { month: '7월', amount: monthlyExpense['7월'] || 0 },
      { month: '8월', amount: monthlyExpense['8월'] || 0 },
      { month: '9월', amount: monthlyExpense['9월'] || 0 },
      { month: '10월', amount: monthlyExpense['10월'] || 0 },
      { month: '11월', amount: monthlyExpense['11월'] || 0 },
      { month: '12월', amount: monthlyExpense['12월'] || 0 },
    ]
  })

  // 카테고리별 지출 데이터
  const expenseCategories = computed(() => {
    const expense = totalExpense.value
    return [
      { name: '정기검진', amount: expense * 0.3 },
      { name: '예방접종', amount: expense * 0.15 },
      { name: '질병치료', amount: expense * 0.33 },
      { name: '수술', amount: expense * 0.12 },
      { name: '약품', amount: expense * 0.1 },
    ]
  })

  // 카테고리 색상
  const categoryColors = [
    '#f59e0b', // 주 색상
    '#fbbf24',
    '#fcd34d',
    '#fde68a',
    '#fef3c7',
  ]

  // 청구 내역 관련 상태
  const claims = ref<Claim[]>([])
  const paginatedClaims = ref<Claim[]>([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const statusFilter = ref('all')
  const dateFilter = ref('all')
  const itemsPerPage = 5
  const showClaimDetailModal = ref(false)
  const selectedClaim = ref<any>(null)

  // 필터링된 청구 내역
  const filteredClaims = computed<Claim[]>(() => {
    let filtered: Claim[] = [...claims.value]

    // 상태 필터링
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter((claim) => claim.status === statusFilter.value)
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

      filtered = filtered.filter((claim) => new Date(claim.date) >= cutoffDate)
    }

    // 정렬 (최신순)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    return filtered
  })

  watch([statusFilter, dateFilter], () => {
    currentPage.value = 1
    updatePaginatedClaims()
  })

  // 유틸리티 함수
  function formatCurrency(amount: number) {
    return amount.toLocaleString('ko-KR') + '원'
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending':
        return '처리중'
      case 'approved':
        return '승인'
      case 'rejected':
        return '거절'
      default:
        return ''
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-dang-pending text-dang-pending-text'
      case 'approved':
        return 'bg-dang-approved text-dang-approved-text'
      case 'rejected':
        return 'bg-dang-rejected text-dang-rejected-text'
      default:
        return ''
    }
  }

  function calculateRefundRate(claim: any) {
    if (claim.claimAmount === 0) return 0
    return Math.round((claim.refundAmount / claim.claimAmount) * 100)
  }

  const updatePaginatedClaims = () => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    paginatedClaims.value = filteredClaims.value.slice(start, end)
    totalPages.value = Math.ceil(filteredClaims.value.length / itemsPerPage)
  }

  function resetFilters() {
    statusFilter.value = 'all'
    dateFilter.value = 'all'
    currentPage.value = 1
  }

  const fetchClaims = async () => {
    claims.value = await loadClaims()
    updatePaginatedClaims()
  }

  return {
    totalExpense,
    claimCount,
    refundRate,
    chartPeriod,
    monthlyExpenseData,
    expenseCategories,
    categoryColors,
    statusFilter,
    dateFilter,
    currentPage,
    itemsPerPage,
    showClaimDetailModal,
    selectedClaim,
    filteredClaims,
    totalPages,
    paginatedClaims,
    updatePaginatedClaims,
    fetchClaims,
    formatCurrency,
    formatDate,
    getStatusText,
    getStatusClass,
    calculateRefundRate,
    resetFilters,
  }
})
