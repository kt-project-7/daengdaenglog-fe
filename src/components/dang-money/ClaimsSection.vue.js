import { useDangMoneyStore } from '@/stores/dangMoneyStore';
import ClaimsFilter from './ClaimsFilter.vue';
import ClaimsTable from './ClaimsTable.vue';
import ClaimsPagination from './ClaimsPagination.vue';
import ClaimDetailModal from './ClaimDetailModal.vue';
const store = useDangMoneyStore();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "relative py-16 px-8 bg-dang-light z-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center mb-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-4xl text-dang-primary font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex max-w-[75rem] w-full mx-auto bg-transparent relative z-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-12 bg-dang-claim-background rounded-l-xl flex flex-col justify-around items-center py-5" },
});
for (const [n] of __VLS_getVForSourceType((8))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (n),
        ...{ class: "w-3 h-3 bg-dang-light rounded-full my-1 shadow-inner" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 bg-dang-background rounded-r-xl p-8 shadow-dang-md relative bg-grid" },
});
/** @type {[typeof ClaimsFilter, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ClaimsFilter, new ClaimsFilter({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof ClaimsTable, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(ClaimsTable, new ClaimsTable({
    ...{ 'onViewDetail': {} },
    claims: (__VLS_ctx.store.paginatedClaims),
}));
const __VLS_4 = __VLS_3({
    ...{ 'onViewDetail': {} },
    claims: (__VLS_ctx.store.paginatedClaims),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onViewDetail: (__VLS_ctx.store.viewClaimDetail)
};
var __VLS_5;
/** @type {[typeof ClaimsPagination, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(ClaimsPagination, new ClaimsPagination({
    ...{ 'onPrev': {} },
    ...{ 'onNext': {} },
    currentPage: (__VLS_ctx.store.currentPage),
    totalPages: (__VLS_ctx.store.totalPages),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onPrev': {} },
    ...{ 'onNext': {} },
    currentPage: (__VLS_ctx.store.currentPage),
    totalPages: (__VLS_ctx.store.totalPages),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onPrev: (__VLS_ctx.store.prevPage)
};
const __VLS_17 = {
    onNext: (__VLS_ctx.store.nextPage)
};
var __VLS_12;
if (__VLS_ctx.store.showClaimDetailModal) {
    /** @type {[typeof ClaimDetailModal, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(ClaimDetailModal, new ClaimDetailModal({
        ...{ 'onClose': {} },
        claim: (__VLS_ctx.store.selectedClaim),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClose': {} },
        claim: (__VLS_ctx.store.selectedClaim),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClose: (__VLS_ctx.store.closeClaimDetailModal)
    };
    var __VLS_20;
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-claim-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-l-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-around']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-r-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-grid']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ClaimsFilter: ClaimsFilter,
            ClaimsTable: ClaimsTable,
            ClaimsPagination: ClaimsPagination,
            ClaimDetailModal: ClaimDetailModal,
            store: store,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
