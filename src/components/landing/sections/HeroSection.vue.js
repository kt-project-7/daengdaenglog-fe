import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const __VLS_props = defineProps();
const isAnimating = ref(true);
const handleStart = () => {
    router.push('/diary-list');
};
// Define paw positions and transformations
const paws = [
    {
        top: '20%',
        left: '10%',
        transform: (scrollY) => `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.03}deg)`,
        class: 'rotate-[-10deg]',
    },
    {
        bottom: '25%',
        left: '15%',
        transform: (scrollY) => `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.02}deg)`,
        class: 'rotate-[15deg]',
    },
    {
        top: '30%',
        right: '15%',
        transform: (scrollY) => `translateY(${scrollY * -0.18}px) rotate(${scrollY * 0.02}deg)`,
        class: 'rotate-[-15deg]',
    },
    {
        bottom: '20%',
        right: '10%',
        transform: (scrollY) => `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.03}deg)`,
        class: 'rotate-[10deg]',
    },
];
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
    // Start the bouncing animation
    startBouncingAnimation();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "relative min-h-screen flex items-center justify-center overflow-hidden" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-10" },
    ...{ style: ({ transform: `translateY(${__VLS_ctx.scrollY * 0.1}px)` }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-[37.5rem] h-[37.5rem] rounded-full bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-30 flex items-center justify-center" },
    ...{ style: ({ transform: `translateY(${Math.max(__VLS_ctx.scrollY * -0.2, -100)}px)` }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center p-8 pt-16 max-w-[37.5rem]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/svgs/title2.svg",
    alt: "댕댕로그",
    ...{ class: "h-20 w-auto mx-auto mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xl md:text-2xl text-_black mb-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "typing-text" },
});
(__VLS_ctx.displayText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "typing-cursor" },
    ...{ class: ({ 'typing-cursor-blink': __VLS_ctx.cursorBlink }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleStart) },
    ...{ class: "block w-fit mx-auto bg-primary text-white border-[3px] border-yellow-600 py-4 px-8 rounded-full text-lg font-bold transition-all hover:bg-primary/80 hover:-translate-y-1 hover:rotate-1 shadow-md hover:shadow-lg cursor-pointer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-full h-full top-0 left-0 z-20" },
    ...{ style: ({
            transform: `translateY(${__VLS_ctx.scrollY * -0.15}px) translateX(${__VLS_ctx.scrollY * 0.05}px)`,
        }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/svgs/dog1.svg",
    alt: "강아지 일러스트",
    ...{ class: "absolute w-[12.5rem] h-auto bottom-[10%] right-[10%] transition-transform duration-500" },
});
for (const [paw, index] of __VLS_getVForSourceType((__VLS_ctx.paws))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute w-full h-full top-0 left-0 z-10" },
        ...{ style: ({ transform: paw.transform(__VLS_ctx.scrollY) }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: "@/assets/svgs/paw1.svg",
        alt: "발자국",
        ...{ class: "absolute w-[5rem] h-auto transition-transform opacity-70" },
        ...{ class: ([
                paw.class,
                { [`bounce-animation-delay-${index}`]: __VLS_ctx.isAnimating },
            ]) },
        ...{ style: ({
                top: paw.top,
                left: paw.left,
                right: paw.right,
                bottom: paw.bottom,
            }) },
    });
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[37.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[37.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary/20']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-30']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[37.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-20']} */ ;
/** @type {__VLS_StyleScopedClasses['w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_black']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-text']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-cursor-blink']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-fit']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-600']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary/80']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:rotate-1']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[12.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-[10%]']} */ ;
/** @type {__VLS_StyleScopedClasses['right-[10%]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isAnimating: isAnimating,
            handleStart: handleStart,
            paws: paws,
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
