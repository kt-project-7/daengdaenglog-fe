import { ref, onMounted, onUnmounted } from 'vue';
import SideMenu from '@/components/landing/navigation/SideMenu.vue';
import HeroSection from '@/components/landing/sections/HeroSection.vue';
import FeaturesSection from '@/components/landing/sections/FeaturesSection.vue';
import StartSection from '@/components/landing/sections/StartSection.vue';
const scrollY = ref(0);
const mainContainer = ref(null);
const isMenuOpen = ref(false);
// 타이핑 애니메이션 관련 변수
const fullText = '소중한 당신의 반려견의 일상을 기록하세요';
const displayText = ref('');
const typingSpeed = 150; // 타이핑 속도 (ms)
const cursorBlink = ref(true);
let typingTimer = null;
let cursorTimer = null;
// 타이핑 애니메이션 시작
const startTypingAnimation = () => {
    let currentIndex = 0;
    // 커서 깜빡임 효과
    cursorTimer = window.setInterval(() => {
        cursorBlink.value = !cursorBlink.value;
    }, 500);
    // 타이핑 효과
    typingTimer = window.setInterval(() => {
        if (currentIndex < fullText.length) {
            displayText.value += fullText.charAt(currentIndex);
            currentIndex++;
        }
        else {
            // 타이핑이 완료되면 타이머 정리
            if (typingTimer !== null) {
                clearInterval(typingTimer);
                typingTimer = null;
            }
            // 타이핑이 끝난 후 3초 후에 다시 시작
            setTimeout(() => {
                displayText.value = '';
                startTypingAnimation();
            }, 3000);
        }
    }, typingSpeed);
};
const handleScroll = () => {
    if (mainContainer.value) {
        scrollY.value = mainContainer.value.scrollTop;
    }
};
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
onMounted(() => {
    if (mainContainer.value) {
        mainContainer.value.addEventListener('scroll', handleScroll);
    }
    // 타이핑 애니메이션 시작
    startTypingAnimation();
});
onUnmounted(() => {
    if (mainContainer.value) {
        mainContainer.value.removeEventListener('scroll', handleScroll);
    }
    // 타이머 정리
    if (typingTimer !== null) {
        clearInterval(typingTimer);
    }
    if (cursorTimer !== null) {
        clearInterval(cursorTimer);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onScroll: (__VLS_ctx.handleScroll) },
    ...{ class: "min-h-screen overflow-y-auto overflow-x-hidden perspective-[.0625rem] scroll-smooth bg-dang-light" },
    ref: "mainContainer",
});
/** @type {typeof __VLS_ctx.mainContainer} */ ;
/** @type {[typeof SideMenu, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SideMenu, new SideMenu({
    ...{ 'onToggleMenu': {} },
    isOpen: (__VLS_ctx.isMenuOpen),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onToggleMenu': {} },
    isOpen: (__VLS_ctx.isMenuOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onToggleMenu: (__VLS_ctx.toggleMenu)
};
var __VLS_2;
/** @type {[typeof HeroSection, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(HeroSection, new HeroSection({
    scrollY: (__VLS_ctx.scrollY),
    ...{ class: "pt-24" },
    displayText: (__VLS_ctx.displayText),
    cursorBlink: (__VLS_ctx.cursorBlink),
}));
const __VLS_8 = __VLS_7({
    scrollY: (__VLS_ctx.scrollY),
    ...{ class: "pt-24" },
    displayText: (__VLS_ctx.displayText),
    cursorBlink: (__VLS_ctx.cursorBlink),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {[typeof FeaturesSection, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(FeaturesSection, new FeaturesSection({
    scrollY: (__VLS_ctx.scrollY),
}));
const __VLS_11 = __VLS_10({
    scrollY: (__VLS_ctx.scrollY),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {[typeof StartSection, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(StartSection, new StartSection({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['perspective-[.0625rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-smooth']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SideMenu: SideMenu,
            HeroSection: HeroSection,
            FeaturesSection: FeaturesSection,
            StartSection: StartSection,
            scrollY: scrollY,
            mainContainer: mainContainer,
            isMenuOpen: isMenuOpen,
            displayText: displayText,
            cursorBlink: cursorBlink,
            handleScroll: handleScroll,
            toggleMenu: toggleMenu,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
