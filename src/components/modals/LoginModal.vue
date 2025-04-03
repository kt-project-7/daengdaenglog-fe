<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { signIn } from '@/apis/auth'
import Swal from 'sweetalert2'

const phoneNumber = ref('')
const password = ref('')
const formError = ref('')
const isLoading = ref(false)

const emit = defineEmits<{
  close: []
  login: [accessToken: string]
}>()

const handleLogin = async () => {
  // 폼 에러 초기화
  formError.value = ''

  if (!phoneNumber.value || !password.value) {
    formError.value = '전화번호와 비밀번호를 입력해주세요.'
    return
  }

  try {
    isLoading.value = true
    const { accessToken } = await signIn({
      phoneNumber: phoneNumber.value,
      password: password.value,
    })

    emit('login', accessToken)

    // 폼 리셋
    phoneNumber.value = ''
    password.value = ''
  } catch (error) {
    console.error('로그인 실패:', error)
    formError.value = '로그인에 실패했습니다. 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md relative z-[10000]">
      <button
        class="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
        @click="$emit('close')"
      >
        <X class="w-6 h-6 text-primary" />
      </button>
      <h2 class="text-2xl text-primary mb-6 text-center font-bold">로그인</h2>

      <!-- 폼 에러 메시지 -->
      <div
        v-if="formError"
        class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
      >
        {{ formError }}
      </div>

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
            @keyup.enter="handleLogin"
          />
        </div>
        <button
          @click="handleLogin"
          class="bg-primary text-white border-none py-3 rounded-lg font-bold cursor-pointer transition-all duration-300 hover:bg-primary/80 mt-4"
          :disabled="isLoading"
        >
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </div>
    </div>
  </div>
</template>
