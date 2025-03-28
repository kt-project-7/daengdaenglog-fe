<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-_gray-100">
    <header class="bg-primary text-white shadow-md">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <div class="title-1 flex items-center">
          <router-link to="/" class="flex items-center">
            <span>🐶 댕댕로그</span>
          </router-link>
        </div>
        <nav>
          <ul class="flex space-x-6 button-text">
            <li>
              <router-link
                to="/"
                class="hover:text-_gray-100 transition-colors"
              >
                일기목록
              </router-link>
            </li>
            <li>
              <router-link
                to="/write"
                class="hover:text-_gray-100 transition-colors"
              >
                일기작성
              </router-link>
            </li>
            <li>
              <router-link
                to="/profile"
                class="hover:text-_gray-100 transition-colors"
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

    <footer class="bg-primary text-white py-4 mt-auto">
      <div class="container mx-auto px-4 text-center body-text">
        <p>© 2025 댕댕로그 - 소중한 반려견과의 추억을 기록하세요</p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
