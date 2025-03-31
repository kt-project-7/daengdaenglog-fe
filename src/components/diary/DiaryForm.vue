<script setup lang="ts">
import { useDiaryStore } from '@/stores/diaryStore'

const diaryStore = useDiaryStore()

defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <form
    @submit.prevent="$emit('submit')"
    class="bg-white rounded-lg shadow-md p-6"
  >
    <div class="mb-4">
      <label class="block text-_black font-medium mb-2">날짜</label>
      <input
        type="date"
        v-model="diaryStore.newDiary.date"
        class="w-full px-3 py-2 border border-_gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        :max="diaryStore.today"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-_black font-medium mb-2">댕댕이 기분</label>
        <select
          v-model="diaryStore.newDiary.mood"
          class="w-full px-3 py-2 border border-_gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="" disabled>기분을 선택하세요</option>
          <option value="happy">😊 행복</option>
          <option value="sad">😢 슬픔</option>
          <option value="angry">😠 화남</option>
          <option value="surprised">😲 놀람</option>
          <option value="hungry">🍴 배고픔</option>
          <option value="hurt">🤕 상처</option>
          <option value="love">💖 사랑</option>
          <option value="sleepy">😴 졸림</option>
        </select>
      </div>

      <div>
        <label class="block text-_black font-medium mb-2">날씨</label>
        <select
          v-model="diaryStore.newDiary.weather"
          class="w-full px-3 py-2 border border-_gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="" disabled>날씨를 선택하세요</option>
          <option value="sunny">☀️ 맑음</option>
          <option value="cloudy">☁️ 흐림</option>
          <option value="rainy">🌧️ 비</option>
          <option value="snowy">❄️ 눈</option>
          <option value="thunderstorm">⚡️ 번개</option>
          <option value="hail">🌨️ 우박</option>
          <option value="foggy">🌫️ 안개</option>
          <option value="yellowdust">💨 황사</option>
        </select>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-_black font-medium mb-2">관찰 내용</label>
      <textarea
        v-model="diaryStore.newDiary.content"
        rows="5"
        class="w-full px-3 py-2 border border-_gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary body-text"
        placeholder="오늘 댕댕이는 어땠나요? 특별한 행동이나 변화가 있었나요?"
        required
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-_black font-medium mb-2"
          >오늘의 산책 시간 (분)</label
        >
        <input
          type="number"
          v-model="diaryStore.newDiary.walkTime"
          min="0"
          class="w-full px-3 py-2 border border-_gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="예: 30"
        />
      </div>

      <div>
        <label class="block text-_black font-medium mb-2"
          >오늘의 식사 시간</label
        >
        <input
          type="text"
          v-model="diaryStore.newDiary.mealTime"
          class="w-full px-3 py-2 border border-_gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="예: 아침 8시, 저녁 6시"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-_gray-200 rounded-md hover:bg-_gray-100 button-text"
      >
        취소
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary button-text"
      >
        일기 저장하기
      </button>
    </div>
  </form>
</template>
