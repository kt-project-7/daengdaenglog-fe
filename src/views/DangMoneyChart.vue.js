import { ref, onMounted, onUnmounted } from 'vue';
import SummarySection from '@/components/dang-money/SummarySection.vue';
import ExpenseCharts from '@/components/dang-money/ExpenseCharts.vue';
import ClaimsSection from '@/components/dang-money/ClaimsSection.vue';
// 상태 관리
const chartContainer = ref(null);
const scrollY = ref(0);
const isAnimating = ref(true);
const handleScroll = () => {
    if (chartContainer.value) {
        scrollY.value = chartContainer.value.scrollTop;
    }
};
// Animation interval to toggle bouncing effect
const startBouncingAnimation = () => {
    setInterval(() => {
        isAnimating.value = true;
        setTimeout(() => {
            isAnimating.value = false;
        }, 1000);
    }, 3000);
};
// 컴포넌트가 마운트될 때 이벤트 리스너 등록
onMounted(() => {
    if (chartContainer.value) {
        chartContainer.value.addEventListener('scroll', handleScroll);
    }
    // 바운싱 애니메이션 시작
    startBouncingAnimation();
});
// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
onUnmounted(() => {
    if (chartContainer.value) {
        chartContainer.value.removeEventListener('scroll', handleScroll);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onScroll: (__VLS_ctx.handleScroll) },
    ...{ class: "min-h-screen bg-dang-light overflow-y-auto overflow-x-hidden scroll-smooth" },
    ref: "chartContainer",
});
/** @type {typeof __VLS_ctx.chartContainer} */ ;
/** @type {[typeof SummarySection, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SummarySection, new SummarySection({
    scrollY: (__VLS_ctx.scrollY),
    isAnimating: (__VLS_ctx.isAnimating),
}));
const __VLS_1 = __VLS_0({
    scrollY: (__VLS_ctx.scrollY),
    isAnimating: (__VLS_ctx.isAnimating),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof ExpenseCharts, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(ExpenseCharts, new ExpenseCharts({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof ClaimsSection, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(ClaimsSection, new ClaimsSection({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-smooth']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SummarySection: SummarySection,
            ExpenseCharts: ExpenseCharts,
            ClaimsSection: ClaimsSection,
            chartContainer: chartContainer,
            scrollY: scrollY,
            isAnimating: isAnimating,
            handleScroll: handleScroll,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
