import { CalendarDays, CloudSun, PenLine, ImagePlus } from 'lucide-vue-next';
const steps = [
    {
        icon: CalendarDays,
        title: '날짜 선택',
        description: '기록하고 싶은 날짜를 선택하세요',
    },
    {
        icon: CloudSun,
        title: '항목 설정',
        description: '그날의 날씨와 기분을 기록하세요',
    },
    {
        icon: PenLine,
        title: '일기 작성',
        description: '특별한 순간을 기록하세요',
    },
    {
        icon: ImagePlus,
        title: '사진 추가',
        description: '소중한 추억을 사진과 함께 저장하세요',
    },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "relative h-screen flex items-center justify-center overflow-hidden p-8 z-30" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute top-1/2 left-[10%] -translate-y-1/2 z-20 hidden md:block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-5 h-[7.5rem] rounded-md shadow-md bg-_red transform -rotate-15 -translate-x-[30px] z-[3] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[15px] before:bg-_red before:brightness-[0.8] before:rounded-t-md after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-r-[10px] after:border-transparent after:border-b-[15px] after:border-b-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-5 h-[7.5rem] rounded-md shadow-md bg-blue-400 transform -rotate-5 z-[2] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[15px] before:bg-blue-400 before:brightness-[0.8] before:rounded-t-md after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-r-[10px] after:border-transparent after:border-b-[15px] after:border-b-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute w-5 h-[7.5rem] rounded-md shadow-md bg-green-400 transform rotate-5 translate-x-[30px] z-[1] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[15px] before:bg-green-400 before:brightness-[0.8] before:rounded-t-md after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-r-[10px] after:border-transparent after:border-b-[15px] after:border-b-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col md:flex-row max-w-5xl w-full bg-transparent relative z-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-full md:w-[1.875rem] h-[1.875rem] md:h-auto bg-[#f59e0b] rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-row md:flex-col justify-around items-center p-0 md:py-5 shadow-md" },
});
for (const [n] of __VLS_getVForSourceType((8))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (n),
        ...{ class: "w-[0.9375rem] h-[0.9375rem] bg-white/80 rounded-full mx-[0.3125rem] my-0 md:my-[0.3125rem] md:mx-0 shadow-[inset_0_0_3px_rgba(0,0,0,0.3)]" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 bg-white rounded-b-lg md:rounded-r-lg md:rounded-bl-none p-8 shadow-md relative bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[length:20px_20px]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-3xl text-[#f59e0b] text-center mb-8 font-bold relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[150px] after:h-[3px] after:bg-[#f59e0b] after:rounded-md" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap justify-between mb-10" },
});
for (const [step, index] of __VLS_getVForSourceType((__VLS_ctx.steps))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "flex flex-col items-center text-center p-4 transition-all duration-300 hover:-translate-y-1 flex-1 min-w-[150px] relative" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-[#f59e0b] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-yellow-600 shadow-md" },
    });
    const __VLS_0 = ((step.icon));
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-[30px] h-[30px] text-white" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-[30px] h-[30px] text-white" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-bold text-[#f59e0b] mb-2" },
    });
    (step.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-_black/70" },
    });
    (step.description);
}
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "/diary-write",
    ...{ class: "block w-fit mx-auto bg-[#f59e0b] text-white border-[3px] border-yellow-600 py-4 px-8 rounded-full text-lg font-bold transition-all hover:bg-[#f59e0b]/80 hover:-translate-y-1 hover:rotate-1 shadow-md hover:shadow-lg" },
}));
const __VLS_6 = __VLS_5({
    to: "/diary-write",
    ...{ class: "block w-fit mx-auto bg-[#f59e0b] text-white border-[3px] border-yellow-600 py-4 px-8 rounded-full text-lg font-bold transition-all hover:bg-[#f59e0b]/80 hover:-translate-y-1 hover:rotate-1 shadow-md hover:shadow-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['z-30']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-[10%]']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[7.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-_red']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-15']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-[30px]']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[3]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['before:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['before:top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['before:left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['before:w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['before:h-[15px]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:bg-_red']} */ ;
/** @type {__VLS_StyleScopedClasses['before:brightness-[0.8]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:rounded-t-md']} */ ;
/** @type {__VLS_StyleScopedClasses['after:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['after:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['after:bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['after:left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-l-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-r-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-b-[15px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-b-white']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[7.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-5']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[2]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['before:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['before:top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['before:left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['before:w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['before:h-[15px]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:bg-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['before:brightness-[0.8]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:rounded-t-md']} */ ;
/** @type {__VLS_StyleScopedClasses['after:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['after:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['after:bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['after:left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-l-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-r-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-b-[15px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-b-white']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[7.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-5']} */ ;
/** @type {__VLS_StyleScopedClasses['translate-x-[30px]']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[1]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['before:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['before:top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['before:left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['before:w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['before:h-[15px]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:bg-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['before:brightness-[0.8]']} */ ;
/** @type {__VLS_StyleScopedClasses['before:rounded-t-md']} */ ;
/** @type {__VLS_StyleScopedClasses['after:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['after:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['after:bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['after:left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-l-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-r-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-b-[15px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:border-b-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-[1.875rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[1.875rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#f59e0b]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-l-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-tr-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-around']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[0.9375rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[0.9375rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-[0.3125rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['my-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:my-[0.3125rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mx-0']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[inset_0_0_3px_rgba(0,0,0,0.3)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-b-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-r-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-bl-none']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[length:20px_20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#f59e0b]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['after:content-[\'\']']} */ ;
/** @type {__VLS_StyleScopedClasses['after:absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['after:bottom-[-10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['after:w-[150px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:h-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:bg-[#f59e0b]']} */ ;
/** @type {__VLS_StyleScopedClasses['after:rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[150px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#f59e0b]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[60px]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-600']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[30px]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[30px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#f59e0b]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_black/70']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-fit']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#f59e0b]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-600']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[#f59e0b]/80']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:rotate-1']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-lg']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            steps: steps,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
