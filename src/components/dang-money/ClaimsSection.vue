<template>
  <section class="relative py-16 px-8 bg-dang-light z-10">
    <div class="text-center mb-12">
      <h2 class="text-4xl text-dang-primary font-bold">보험 청구 내역</h2>
    </div>

    <div class="flex max-w-[1200px] w-full mx-auto bg-transparent relative z-5">
      <div
        class="w-[30px] bg-[#e0a458] rounded-l-[10px] flex flex-col justify-around items-center py-5"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="w-[15px] h-[15px] bg-dang-light rounded-full my-[5px] shadow-inner"
        ></div>
      </div>

      <div
        class="flex-1 bg-dang-background rounded-r-[10px] p-8 shadow-dang-md relative bg-grid"
      >
        <ClaimsFilter />
        <ClaimsTable
          :claims="store.paginatedClaims"
          @view-detail="store.viewClaimDetail"
        />
        <ClaimsPagination
          :current-page="store.currentPage"
          :total-pages="store.totalPages"
          @prev="store.prevPage"
          @next="store.nextPage"
        />
      </div>
    </div>

    <ClaimDetailModal
      v-if="store.showClaimDetailModal"
      :claim="store.selectedClaim"
      @close="store.closeClaimDetailModal"
    />
  </section>
</template>

<script setup lang="ts">
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import ClaimsFilter from './ClaimsFilter.vue'
import ClaimsTable from './ClaimsTable.vue'
import ClaimsPagination from './ClaimsPagination.vue'
import ClaimDetailModal from './ClaimDetailModal.vue'

const store = useDangMoneyStore()
</script>
