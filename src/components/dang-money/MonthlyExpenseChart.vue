<template>
  <div
    class="bg-dang-light rounded-xl p-8 shadow-dang-md transition-all duration-300 hover:-translate-y-1 hover:shadow-dang-lg"
  >
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl text-dang-primary font-bold">월별 지출 내역</h3>
      <div class="flex gap-2">
        <button
          @click="store.changeChartPeriod('month')"
          :class="[
            'py-2 px-4 rounded-full text-sm transition-all duration-200',
            store.chartPeriod === 'month'
              ? 'bg-dang-primary text-white'
              : 'bg-_gray-100 text-_gray-400',
          ]"
        >
          월별
        </button>
        <button
          @click="store.changeChartPeriod('year')"
          :class="[
            'py-2 px-4 rounded-full text-sm transition-all duration-200',
            store.chartPeriod === 'year'
              ? 'bg-dang-primary text-white'
              : 'bg-_gray-100 text-_gray-400',
          ]"
        >
          연도별
        </button>
      </div>
    </div>
    <div class="h-[18.75rem] relative">
      <canvas ref="monthlyExpenseChart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import Chart from 'chart.js/auto'

const store = useDangMoneyStore()
const monthlyExpenseChart = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// 차트 초기화
const initChart = () => {
  if (!monthlyExpenseChart.value) return

  const ctx = monthlyExpenseChart.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: store.monthlyExpenseData.map((item) => item.month),
      datasets: [
        {
          label: '지출 금액',
          data: store.monthlyExpenseData.map((item) => item.amount),
          backgroundColor: '#f59e0b',
          borderColor: '#f59e0b',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + '원'
            },
          },
        },
      },
    },
  })
}

// 차트 업데이트
const updateChart = () => {
  if (!chart) return

  let labels, data

  if (store.chartPeriod === 'month') {
    labels = store.monthlyExpenseData.map((item) => item.month)
    data = store.monthlyExpenseData.map((item) => item.amount)
  } else {
    // 연도별 데이터 (예시)
    labels = ['2022년', '2023년', '2024년', '2025년']
    data = [1200000, 1500000, 1800000, 2850000]
  }

  chart.data.labels = labels
  chart.data.datasets[0].data = data
  chart.update()
}

// 기간 변경 감시
watch(
  () => store.chartPeriod,
  () => {
    updateChart()
  },
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>
