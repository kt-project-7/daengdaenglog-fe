<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md relative">
      <button
        class="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
        @click="$emit('close')"
      >
        <X class="w-6 h-6 text-primary" />
      </button>
      <h2 class="text-2xl text-primary mb-6 text-center font-bold">로그인</h2>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label for="phone" class="font-bold text-_black">전화번호</label>
          <input
            type="tel"
            id="phone"
            v-model="phoneNumber"
            placeholder="전화번호를 입력하세요"
            class="p-3 border border-'_gray-200' rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password" class="font-bold text-_black">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            class="p-3 border border-'_gray-200' rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          @click="handleLogin"
          class="bg-primary text-white border-none py-3 rounded-lg font-bold cursor-pointer transition-all duration-300 hover:bg-primary/80 mt-4"
        >
          로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const phoneNumber = ref('')
const password = ref('')

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login', success: boolean): void
}>()

const handleLogin = () => {
  if (phoneNumber.value && password.value) {
    emit('login', true)
    // Reset form
    phoneNumber.value = ''
    password.value = ''
  } else {
    alert('전화번호와 비밀번호를 입력해주세요.')
  }
}
</script>
