import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './assets/tailwind.css'
import router from './router'
import api from '@/apis/axios'
import Swal from 'sweetalert2'

// SweetAlert2 기본 설정 - z-index를 모달보다 높게 설정
Swal.mixin({
  customClass: {
    container: 'sweet-alert-container', // CSS에서 z-index를 설정할 클래스
  },
})

const app = createApp(App)
const token = localStorage.getItem('accessToken')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
app.use(createPinia())
app.use(router)
app.mount('#app')
