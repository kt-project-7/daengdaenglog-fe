<script setup lang="ts">
import { useDiaryStore } from '@/stores/diary'

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
      <label class="block text-gray-700 font-medium mb-2">날짜</label>
      <input
        type="date"
        v-model="diaryStore.newDiary.date"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        :max="diaryStore.today"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-gray-700 font-medium mb-2">댕댕이 기분</label>
        <select
          v-model="diaryStore.newDiary.mood"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="" disabled>기분을 선택하세요</option>
          <option value="happy">😊 기쁨</option>
          <option value="sad">😢 슬픔</option>
          <option value="energetic">🤩 활발</option>
          <option value="tired">😴 피곤</option>
          <option value="angry">😠 화남</option>
          <option value="calm">😌 평온</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-2">날씨</label>
        <select
          v-model="diaryStore.newDiary.weather"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="" disabled>날씨를 선택하세요</option>
          <option value="sunny">☀️ 맑음</option>
          <option value="cloudy">☁️ 흐림</option>
          <option value="rainy">🌧️ 비</option>
          <option value="snowy">❄️ 눈</option>
          <option value="windy">💨 바람</option>
        </select>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">관찰 내용</label>
      <textarea
        v-model="diaryStore.newDiary.content"
        rows="5"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="오늘 댕댕이는 어땠나요? 특별한 행동이나 변화가 있었나요?"
        required
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >오늘의 산책 시간 (분)</label
        >
        <input
          type="number"
          v-model="diaryStore.newDiary.walkTime"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="예: 30"
        />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >오늘의 식사 시간</label
        >
        <input
          type="text"
          v-model="diaryStore.newDiary.mealTime"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="예: 아침 8시, 저녁 6시"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        취소
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        일기 저장하기
      </button>
    </div>
  </form>
</template>
