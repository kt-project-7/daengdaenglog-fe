<template>
  <div
    class="bg-dang-light rounded-xl p-8 shadow-dang-md transition-all duration-300 hover:-translate-y-1 hover:shadow-dang-lg"
  >
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl text-dang-primary font-bold">카테고리별 지출</h3>
    </div>
    <div class="h-[18.75rem] relative">
      <canvas ref="categoryExpenseChart"></canvas>
    </div>
    <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="(category, index) in store.expenseCategories"
        :key="index"
        class="flex items-center gap-2"
      >
        <div
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: store.categoryColors[index] }"
        ></div>
        <div class="flex flex-col">
          <span class="text-sm text-_gray-400">{{ category.name }}</span>
          <span class="text-xs font-bold text-dang-primary">{{
            store.formatCurrency(category.amount)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import Chart from 'chart.js/auto'

const store = useDangMoneyStore()
const categoryExpenseChart = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// 차트 초기화
const initChart = () => {
  if (!categoryExpenseChart.value) return

  const ctx = categoryExpenseChart.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: store.expenseCategories.map((item) => item.name),
      datasets: [
        {
          data: store.expenseCategories.map((item) => item.amount),
          backgroundColor: store.categoryColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw as number
              return value.toLocaleString() + '원'
            },
          },
        },
      },
    },
  })
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>
