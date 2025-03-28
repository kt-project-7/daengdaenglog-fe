<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-amber-50">
    <header class="bg-amber-500 text-white shadow-md">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <div class="text-2xl font-bold flex items-center">
          <router-link to="/" class="flex items-center">
            <span>🐶 댕댕로그</span>
          </router-link>
        </div>
        <nav>
          <ul class="flex space-x-6">
            <li>
              <router-link
                to="/"
                class="hover:text-amber-200 transition-colors"
              >
                일기목록
              </router-link>
            </li>
            <li>
              <router-link
                to="/write"
                class="hover:text-amber-200 transition-colors"
              >
                일기작성
              </router-link>
            </li>
            <li>
              <router-link
                to="/profile"
                class="hover:text-amber-200 transition-colors"
              >
                프로필
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>

    <footer class="bg-amber-500 text-white py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p>© 2025 댕댕로그 - 소중한 반려견과의 추억을 기록하세요</p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
