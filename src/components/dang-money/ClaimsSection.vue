<template>
  <section class="relative py-16 px-8 bg-dang-light z-10">
    <div class="text-center mb-12">
      <h2 class="text-4xl text-dang-primary font-bold">보험 청구 내역</h2>
    </div>

    <div class="flex max-w-[75rem] w-full mx-auto bg-transparent relative z-5">
      <div
        class="w-12 bg-dang-claim-background rounded-l-xl flex flex-col justify-around items-center py-5"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="w-3 h-3 bg-dang-light rounded-full my-1 shadow-inner"
        ></div>
      </div>

      <div
        class="flex-1 bg-dang-background rounded-r-xl p-8 shadow-dang-md relative bg-grid"
      >
        <ClaimsFilter />
        <ClaimsTable
          :claims="store.paginatedClaims"
          @view-detail="viewClaimDetail"
        />
        <ClaimsPagination
          :current-page="store.currentPage"
          :total-pages="store.totalPages"
          @prev="prevPage"
          @next="nextPage"
        />
      </div>
    </div>

    <ClaimDetailModal
      v-if="store.showClaimDetailModal"
      :claim="store.selectedClaim"
      @close="closeClaimDetailModal"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDangMoneyStore } from '@/stores/dangMoneyStore'
import ClaimsFilter from './ClaimsFilter.vue'
import ClaimsTable from './ClaimsTable.vue'
import ClaimsPagination from './ClaimsPagination.vue'
import ClaimDetailModal from './ClaimDetailModal.vue'

const store = useDangMoneyStore()

function viewClaimDetail(claim: any) {
  store.selectedClaim = claim
  store.showClaimDetailModal = true
}

function closeClaimDetailModal() {
  store.showClaimDetailModal = false
  store.selectedClaim = null
}

// 청구 내역 함수
function prevPage() {
  if (store.currentPage > 1) {
    store.currentPage--
    store.updatePaginatedClaims()
  }
}

function nextPage() {
  if (store.currentPage < store.totalPages) {
    store.currentPage++
    store.updatePaginatedClaims()
  }
}

onMounted(() => {
  store.fetchClaims()
})
</script>
