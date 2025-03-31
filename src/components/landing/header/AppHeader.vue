<template>
  <header
    class="fixed top-0 left-0 w-full h-16 flex justify-between items-center p-4 md:px-8 bg-white/90 backdrop-blur-sm z-40 shadow-sm"
  >
    <div class="flex items-center gap-2">
      <button
        class="bg-transparent border-none flex items-center justify-center p-2 cursor-pointer"
        @click="$emit('toggleMenu')"
      >
        <Menu class="w-6 h-6 text-primary" />
      </button>
      <router-link to="/">
        <img
          src="@/assets/svgs/title2.svg"
          alt="댕댕로그"
          class="h-8 w-auto cursor-pointer"
        />
      </router-link>
    </div>
    <div class="flex gap-4">
      <button
        v-if="!isLoggedIn"
        @click="$emit('showLogin')"
        class="bg-primary text-white border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:bg-primary/80 hover:-translate-y-0.5"
      >
        로그인
      </button>
      <template v-else>
        <router-link to="/diary-list">
          <button
            class="bg-primary text-white border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:bg-primary/80 hover:-translate-y-0.5"
          >
            일기장
          </button>
        </router-link>
        <router-link to="/profile">
          <button
            class="bg-primary text-white border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:bg-primary/80 hover:-translate-y-0.5"
          >
            프로필
          </button>
        </router-link>
      </template>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Menu } from 'lucide-vue-next'

defineProps<{
  isLoggedIn: boolean
}>()

defineEmits<{
  (e: 'toggleMenu'): void
  (e: 'showLogin'): void
}>()
</script>
