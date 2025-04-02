<template>
  <div class="mb-8">
    <div
      v-if="claims.length === 0"
      class="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm"
    >
      <FileQuestion class="w-16 h-16 text-_gray-200 mb-4" />
      <p class="text-_gray-300 text-lg">보험 청구 내역이 없습니다.</p>
    </div>

    <div v-else class="overflow-x-auto rounded-xl shadow-sm">
      <table class="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              날짜
            </th>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              병원명
            </th>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              진료내용
            </th>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              청구금액
            </th>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              환급금액
            </th>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              상태
            </th>
            <th class="p-4 text-left bg-_gray-100 font-bold text-_gray-400">
              상세
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="claim in claims"
            :key="claim.id ?? ''"
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
                @click="viewDetail(claim)"
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
</template>

<script setup lang="ts">
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import { FileQuestion, Eye } from 'lucide-vue-next'

const store = useDangMoneyStore()

type Claim = {
  id: number | null
  date: string
  hospital: string
  description: string
  medicalFee: number
  claimAmount: number
  refundAmount: number
  status: string
}

defineProps<{
  claims: Claim[]
}>()

const emit = defineEmits<{
  (e: 'viewDetail', claim: any): void
}>()

const viewDetail = (claim: any) => {
  emit('viewDetail', claim)
}

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
      return 'bg-dang-pending text-dang-pending-text px-2 py-1 rounded'
    case 'approved':
      return 'bg-dang-approved text-dang-approved-text px-2 py-1 rounded'
    case 'rejected':
      return 'bg-dang-rejected text-dang-rejected-text px-2 py-1 rounded'
    default:
      return ''
  }
}
</script>
