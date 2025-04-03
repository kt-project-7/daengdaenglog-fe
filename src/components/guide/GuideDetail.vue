<script setup lang="ts">
import { Pencil, ChevronRight } from 'lucide-vue-next'
import { GuideDetail } from '@/types/guide'
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const props = defineProps<{
  selectedGuide: GuideDetail | null
}>()

const emit = defineEmits<{
  (e: 'back-to-list'): void
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const backToList = () => {
  emit('back-to-list')
}

// 마크다운 파서 인스턴스 생성
const md = new MarkdownIt({
  html: false, // HTML 태그 비활성화 (보안)
  breaks: true, // 줄바꿈 활성화
  linkify: true, // URL을 링크로 변환
  typographer: true, // 특수문자 변환
})

// 마크다운 렌더링 함수
const renderedContent = computed(() => {
  if (!props.selectedGuide || !props.selectedGuide.content) return ''
  return md.render(props.selectedGuide.content)
})
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <button
        @click="backToList"
        class="mr-4 p-2 rounded-full hover:bg-_gray-100 transition-colors"
      >
        <ChevronRight class="w-5 h-5 text-_gray-700 transform rotate-180" />
      </button>
      <h2 class="text-2xl font-bold text-_gray-800">가이드 상세보기</h2>
    </div>

    <div v-if="selectedGuide" class="space-y-8 mb-4">
      <!-- Guide header -->
      <div class="text-center mb-6">
        <div
          class="inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4"
        >
          <Pencil class="w-12 h-12 text-chart-category3" />
        </div>
        <h3 class="text-2xl font-bold text-chart-category3">
          {{ selectedGuide.petName }}의 가이드
        </h3>
        <p class="text-lg text-_gray-500 mt-2">
          {{ formatDate(selectedGuide.createdDate) }} 생성
        </p>
      </div>

      <!-- Guide content with markdown rendering -->
      <div
        class="bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20"
      >
        <h4 class="text-xl font-bold text-chart-category3 mb-4">가이드 내용</h4>
        <div
          class="markdown-content text-_gray-700 leading-relaxed text-lg"
          v-html="renderedContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-content :deep(h1) {
  font-size: 1.8em;
  font-weight: bold;
  margin: 0.8em 0;
  color: #333;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.7em 0;
  color: #444;
}

.markdown-content :deep(h3) {
  font-size: 1.3em;
  font-weight: bold;
  margin: 0.6em 0;
  color: #555;
}

.markdown-content :deep(h4) {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0.5em 0;
  color: #666;
}

.markdown-content :deep(p) {
  margin: 0.8em 0;
  line-height: 1.6;
}

.markdown-content :deep(strong) {
  font-weight: bold;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  padding-left: 1em;
  margin-left: 0;
  color: #666;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 2em;
  margin: 0.5em 0;
}

.markdown-content :deep(li) {
  margin: 0.3em 0;
}

.markdown-content :deep(a) {
  color: #3498db;
  text-decoration: underline;
}

.markdown-content :deep(hr) {
  border: 0;
  border-top: 1px solid #eee;
  margin: 1.5em 0;
}

.markdown-content :deep(code) {
  background-color: #f8f8f8;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}
</style>
