import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import './assets/tailwind.css';
import router from './router';
import api from '@/apis/axios';
const app = createApp(App);
const token = localStorage.getItem('accessToken');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
app.use(createPinia());
app.use(router);
app.mount('#app');
