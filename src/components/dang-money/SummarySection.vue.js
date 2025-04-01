import { ref, onMounted } from 'vue';
import { useDangMoneyStore } from '@/stores/dangMoneyStore';
import SummaryCard from './SummaryCard.vue';
const store = useDangMoneyStore();
const scrollY = ref(0);
const isAnimating = ref(true);
const __VLS_props = defineProps();
// Animation interval to toggle bouncing effect
const startBouncingAnimation = () => {
    setInterval(() => {
        isAnimating.value = true;
        setTimeout(() => {
            isAnimating.value = false;
        }, 1000);
    }, 3000);
};
onMounted(() => {
    // 바운싱 애니메이션 시작
    startBouncingAnimation();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "relative h-[50vh] flex items-center justify-center overflow-hidden" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-[1]" },
    ...{ style: ({ transform: `translateY(${__VLS_ctx.scrollY * 0.1}px)` }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-[37.5rem] h-[37.5rem] rounded-full bg-dang-primary opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-[5] flex items-center justify-center" },
    ...{ style: ({ transform: `translateY(${__VLS_ctx.scrollY * -0.2}px)` }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center p-8 max-w-[50rem] relative z-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-4xl md:text-5xl text-dang-primary mb-4 font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-lg md:text-xl text-_gray-400 mb-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col md:flex-row justify-around gap-4 md:gap-8 mt-8" },
});
/** @type {[typeof SummaryCard, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SummaryCard, new SummaryCard({
    icon: "DollarSign",
    title: "총 지출",
    value: (__VLS_ctx.store.formatCurrency(__VLS_ctx.store.totalExpense)),
}));
const __VLS_1 = __VLS_0({
    icon: "DollarSign",
    title: "총 지출",
    value: (__VLS_ctx.store.formatCurrency(__VLS_ctx.store.totalExpense)),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof SummaryCard, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(SummaryCard, new SummaryCard({
    icon: "FileText",
    title: "청구 건수",
    value: (`${__VLS_ctx.store.claimCount}건`),
}));
const __VLS_4 = __VLS_3({
    icon: "FileText",
    title: "청구 건수",
    value: (`${__VLS_ctx.store.claimCount}건`),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof SummaryCard, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(SummaryCard, new SummaryCard({
    icon: "TrendingUp",
    title: "환급률",
    value: (`${__VLS_ctx.store.refundRate}%`),
}));
const __VLS_7 = __VLS_6({
    icon: "TrendingUp",
    title: "환급률",
    value: (`${__VLS_ctx.store.refundRate}%`),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-[3]" },
    ...{ style: ({
            transform: `translateY(${__VLS_ctx.scrollY * -0.15}px) translateX(${__VLS_ctx.scrollY * 0.05}px)`,
        }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/svgs/dog2.svg",
    alt: "강아지 일러스트",
    ...{ class: "absolute w-[7.5rem] md:w-[4.6875rem] h-auto bottom-[10%] right-[15%]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-[2]" },
    ...{ style: ({
            transform: `translateY(${__VLS_ctx.scrollY * -0.3}px) rotate(${__VLS_ctx.scrollY * 0.05}deg)`,
        }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/svgs/paw1.svg",
    alt: "발자국",
    ...{ class: "absolute w-[3.75rem] h-auto bottom-[40%] left-[20%] -rotate-[15deg] animate-bounce-delay-1 opacity-50" },
    ...{ class: ({ 'animate-bounce-custom': __VLS_ctx.isAnimating }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-[2]" },
    ...{ style: ({
            transform: `translateY(${__VLS_ctx.scrollY * -0.25}px) translateX(${__VLS_ctx.scrollY * -0.1}px) rotate(${__VLS_ctx.scrollY * -0.03}deg)`,
        }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/svgs/paw1.svg",
    alt: "발자국",
    ...{ class: "absolute w-[3.75rem] h-auto bottom-[25%] left-[15%] rotate-[20deg] animate-bounce-delay-2 opacity-50" },
    ...{ class: ({ 'animate-bounce-delay-1': __VLS_ctx.isAnimating }) },
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[50vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[1]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[37.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[37.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[5]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[50rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-around']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[3]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[7.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-[4.6875rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-[10%]']} */ ;
/** @type {__VLS_StyleScopedClasses['right-[15%]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[2]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[3.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-[40%]']} */ ;
/** @type {__VLS_StyleScopedClasses['left-[20%]']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-[15deg]']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-delay-1']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[2]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[3.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-[25%]']} */ ;
/** @type {__VLS_StyleScopedClasses['left-[15%]']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-[20deg]']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-delay-2']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-delay-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SummaryCard: SummaryCard,
            store: store,
            scrollY: scrollY,
            isAnimating: isAnimating,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
