import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/landing/header/AppHeader.vue';
import SideMenu from '@/components/landing/navigation/SideMenu.vue';
import LoginModal from '@/components/modals/LoginModal.vue';
import AppFooter from '@/components/landing/footer/AppFooter.vue';
import { useAuthStore } from '@/stores/authStore';
const router = useRouter();
const isMenuOpen = ref(false);
const authStore = useAuthStore();
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
const handleLogin = (token) => {
    authStore.login(token);
    if (authStore.pendingRoute) {
        router.push(authStore.pendingRoute.fullPath);
        authStore.clearPendingRoute();
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen flex flex-col" },
});
/** @type {[typeof AppHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppHeader, new AppHeader({
    ...{ 'onShowLogin': {} },
    ...{ 'onToggleMenu': {} },
    isLoggedIn: (__VLS_ctx.authStore.isAuthenticated),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onShowLogin': {} },
    ...{ 'onToggleMenu': {} },
    isLoggedIn: (__VLS_ctx.authStore.isAuthenticated),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onShowLogin: (...[$event]) => {
        __VLS_ctx.authStore.showLoginModal = true;
    }
};
const __VLS_7 = {
    onToggleMenu: (__VLS_ctx.toggleMenu)
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "flex-1 mt-16" },
});
const __VLS_8 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof SideMenu, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(SideMenu, new SideMenu({
    ...{ 'onToggleMenu': {} },
    isOpen: (__VLS_ctx.isMenuOpen),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onToggleMenu': {} },
    isOpen: (__VLS_ctx.isMenuOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onToggleMenu: (__VLS_ctx.toggleMenu)
};
var __VLS_14;
if (__VLS_ctx.authStore.showLoginModal) {
    /** @type {[typeof LoginModal, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(LoginModal, new LoginModal({
        ...{ 'onClose': {} },
        ...{ 'onLogin': {} },
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClose': {} },
        ...{ 'onLogin': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_22;
    let __VLS_23;
    let __VLS_24;
    const __VLS_25 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.authStore.showLoginModal))
                return;
            __VLS_ctx.authStore.showLoginModal = false;
        }
    };
    const __VLS_26 = {
        onLogin: (__VLS_ctx.handleLogin)
    };
    var __VLS_21;
}
/** @type {[typeof AppFooter, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(AppFooter, new AppFooter({}));
const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppHeader: AppHeader,
            SideMenu: SideMenu,
            LoginModal: LoginModal,
            AppFooter: AppFooter,
            isMenuOpen: isMenuOpen,
            authStore: authStore,
            toggleMenu: toggleMenu,
            handleLogin: handleLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
