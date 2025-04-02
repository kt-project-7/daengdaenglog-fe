<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[3000]"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl w-[90%] max-w-[37.5rem] max-h-[90vh] overflow-y-auto relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
      >
        <X class="w-6 h-6 text-dang-primary" />
      </button>

      <h2 class="text-2xl text-dang-primary p-6 border-b border-_gray-100 m-0">
        청구 상세 정보
      </h2>

      <div class="p-6" v-if="claim">
        <div class="flex justify-between items-center mb-6">
          <span
            class="inline-block py-2 px-4 rounded-full text-sm font-bold"
            :class="store.getStatusClass(claim.status)"
          >
            {{ store.getStatusText(claim.status) }}
          </span>
          <div class="text-sm text-_gray-300">
            {{ store.formatDate(claim.date) }}
          </div>
        </div>

        <div class="bg-_gray-100 rounded-xl p-6 mb-6">
          <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
            <span class="font-bold text-_gray-400">병원명</span>
            <span class="text-_black">{{ claim.hospital }}</span>
          </div>
          <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
            <span class="font-bold text-_gray-400">진료내용</span>
            <span class="text-_black">{{ claim.description }}</span>
          </div>
          <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
            <span class="font-bold text-_gray-400">진료비</span>
            <span class="text-_black">{{
              store.formatCurrency(claim.medicalFee)
            }}</span>
          </div>
          <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
            <span class="font-bold text-_gray-400">청구금액</span>
            <span class="text-_black">{{
              store.formatCurrency(claim.claimAmount)
            }}</span>
          </div>
          <div class="flex justify-between mb-3 pb-3 border-b border-_gray-200">
            <span class="font-bold text-_gray-400">환급금액</span>
            <span class="text-_black">{{
              store.formatCurrency(claim.refundAmount)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-bold text-_gray-400">환급률</span>
            <span class="text-_black"
              >{{ store.calculateRefundRate(claim) }}%</span
            >
          </div>
        </div>
      </div>

      <div class="flex justify-end p-6 border-t border-_gray-100">
        <button
          @click="$emit('close')"
          class="bg-_gray-100 text-_gray-400 border-none py-3 px-6 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-_gray-200"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import { X } from 'lucide-vue-next'

const store = useDangMoneyStore()

defineProps<{
  claim: any
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
