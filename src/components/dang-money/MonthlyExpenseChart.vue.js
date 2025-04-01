import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useDangMoneyStore } from '@/stores/dangMoneyStore';
import Chart from 'chart.js/auto';
const store = useDangMoneyStore();
const monthlyExpenseChart = ref(null);
let chart = null;
// 차트 초기화
const initChart = () => {
    if (!monthlyExpenseChart.value)
        return;
    const ctx = monthlyExpenseChart.value.getContext('2d');
    if (!ctx)
        return;
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: store.monthlyExpenseData.map((item) => item.month),
            datasets: [
                {
                    label: '지출 금액',
                    data: store.monthlyExpenseData.map((item) => item.amount),
                    backgroundColor: '#f59e0b',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + '원';
                        },
                    },
                },
            },
        },
    });
};
// 차트 업데이트
const updateChart = () => {
    if (!chart)
        return;
    let labels, data;
    if (store.chartPeriod === 'month') {
        labels = store.monthlyExpenseData.map((item) => item.month);
        data = store.monthlyExpenseData.map((item) => item.amount);
    }
    else {
        // 연도별 데이터 (예시)
        labels = ['2022년', '2023년', '2024년', '2025년'];
        data = [1200000, 1500000, 1800000, 2850000];
    }
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
};
// 기간 변경 감시
watch(() => store.chartPeriod, () => {
    updateChart();
});
onMounted(() => {
    initChart();
});
onUnmounted(() => {
    if (chart) {
        chart.destroy();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-dang-light rounded-xl p-8 shadow-dang-md transition-all duration-300 hover:-translate-y-1 hover:shadow-dang-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-xl text-dang-primary font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.store.changeChartPeriod('month');
        } },
    ...{ class: ([
            'py-2 px-4 rounded-full text-sm transition-all duration-200',
            __VLS_ctx.store.chartPeriod === 'month'
                ? 'bg-dang-primary text-white'
                : 'bg-_gray-100 text-_gray-400',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.store.changeChartPeriod('year');
        } },
    ...{ class: ([
            'py-2 px-4 rounded-full text-sm transition-all duration-200',
            __VLS_ctx.store.chartPeriod === 'year'
                ? 'bg-dang-primary text-white'
                : 'bg-_gray-100 text-_gray-400',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-[18.75rem] relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({
    ref: "monthlyExpenseChart",
});
/** @type {typeof __VLS_ctx.monthlyExpenseChart} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-dang-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[18.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            monthlyExpenseChart: monthlyExpenseChart,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
