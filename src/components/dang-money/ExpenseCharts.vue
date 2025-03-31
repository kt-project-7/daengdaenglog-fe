<template>
  <section class="relative py-16 px-8 bg-white z-10">
    <div class="text-center mb-12">
      <h2 class="text-4xl text-dang-primary font-bold">지출 분석</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
      <MonthlyExpenseChart />
      <CategoryExpenseChart />
    </div>
  </section>
</template>

<script setup lang="ts">
import MonthlyExpenseChart from './MonthlyExpenseChart.vue'
import CategoryExpenseChart from './CategoryExpenseChart.vue'
</script>
