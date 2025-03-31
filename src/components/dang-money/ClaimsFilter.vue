<template>
  <div class="flex flex-wrap gap-4 mb-8 items-center">
    <div class="flex flex-col gap-2">
      <label for="status-filter" class="text-sm text-_gray-400 font-bold"
        >상태</label
      >
      <select
        id="status-filter"
        v-model="store.statusFilter"
        class="py-2 px-4 border border-_gray-200 rounded-lg bg-white min-w-[120px]"
      >
        <option value="all">전체</option>
        <option value="pending">처리중</option>
        <option value="approved">승인</option>
        <option value="rejected">거절</option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label for="date-filter" class="text-sm text-_gray-400 font-bold"
        >기간</label
      >
      <select
        id="date-filter"
        v-model="store.dateFilter"
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
      @click="store.resetFilters"
      class="flex items-center gap-2 bg-_gray-100 border-none py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-_gray-200 ml-auto self-end"
    >
      <RefreshCw class="w-4 h-4" />
      초기화
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import { RefreshCw } from 'lucide-vue-next'

const store = useDangMoneyStore()
</script>
