import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/apis/axios';
export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false);
    const accessToken = ref(null);
    const showLoginModal = ref(false);
    const pendingRoute = ref(null);
    const initializeAuth = () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            isAuthenticated.value = true;
            accessToken.value = token;
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };
    const login = (token) => {
        isAuthenticated.value = true;
        accessToken.value = token;
        localStorage.setItem('accessToken', token);
        showLoginModal.value = false;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };
    const logout = () => {
        isAuthenticated.value = false;
        accessToken.value = null;
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
    };
    const setPendingRoute = (route) => {
        pendingRoute.value = route;
    };
    const clearPendingRoute = () => {
        pendingRoute.value = null;
    };
    // 초기화
    initializeAuth();
    return {
        isAuthenticated,
        accessToken,
        showLoginModal,
        pendingRoute,
        login,
        logout,
        initializeAuth,
        setPendingRoute,
        clearPendingRoute,
    };
});
