import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDiaryStore } from '@/stores/diaryStore';
import { formatDate, getMoodEmoji, getWeatherEmoji } from '@/utils/formatters';
import DiaryEditModal from '@/components/diary/DiaryEditModal.vue';
import { Edit, Trash2, MoreVertical } from 'lucide-vue-next';
const router = useRouter();
const diaryStore = useDiaryStore();
// 날짜 필터 입력값
const dateFilter = ref({
    start: '',
    end: '',
});
// 날짜 필터 적용값 (적용 버튼 클릭 시에만 업데이트)
const appliedDateFilter = ref({
    start: '',
    end: '',
});
// 날짜 필터 에러 메시지
const dateFilterError = ref('');
// 기분 필터
const selectedMood = ref('all');
// 정렬 옵션
const sortOption = ref('newest');
// 무한 스크롤 관련 변수
const itemsPerPage = 5;
const currentPage = ref(1);
const isLoading = ref(false);
const hasMoreData = ref(true);
const observer = ref(null);
const loadingTriggerRef = ref(null);
// 수정 모달 관련 변수
const showEditModal = ref(false);
const currentEditDiary = ref(null);
// 삭제 확인 모달 관련 변수
const showDeleteConfirm = ref(false);
const diaryToDelete = ref(null);
// 드롭다운 메뉴 상태 관리
const openDropdownId = ref(null);
// 기분 옵션 배열 추가
const moodOptions = [
    'happy',
    'sad',
    'angry',
    'surprised',
    'hungry',
    'hurt',
    'love',
    'sleepy',
];
// 필터 및 정렬이 적용된 일기 목록
const filteredDiaries = computed(() => {
    // 기본 일기 목록
    let result = [...diaryStore.diaries];
    // 날짜 필터 적용
    if (appliedDateFilter.value.start) {
        const startDate = new Date(appliedDateFilter.value.start);
        result = result.filter((diary) => new Date(diary.date) >= startDate);
    }
    if (appliedDateFilter.value.end) {
        const endDate = new Date(appliedDateFilter.value.end);
        // 종료일 포함을 위해 endDate를 하루 뒤로 설정
        endDate.setDate(endDate.getDate() + 1);
        result = result.filter((diary) => new Date(diary.date) < endDate);
    }
    // 기분 필터 적용
    if (selectedMood.value !== 'all') {
        result = result.filter((diary) => diary.mood === selectedMood.value);
    }
    // 정렬 적용
    result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOption.value === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
});
// 현재 페이지까지 보여줄 일기 목록 (무한 스크롤용)
const visibleDiaries = computed(() => {
    const endIndex = currentPage.value * itemsPerPage;
    return filteredDiaries.value.slice(0, endIndex);
});
// 시작일 변경 시 종료일 최소값 업데이트
const handleStartDateChange = () => {
    // 시작일이 설정되었고, 종료일이 시작일보다 빠른 경우 종료일을 초기화
    if (dateFilter.value.start &&
        dateFilter.value.end &&
        new Date(dateFilter.value.end) < new Date(dateFilter.value.start)) {
        dateFilter.value.end = '';
    }
    dateFilterError.value = '';
};
// 날짜 필터 적용
const applyDateFilter = () => {
    // 시작일과 종료일이 모두 설정되었을 때 유효성 검사
    if (dateFilter.value.start && dateFilter.value.end) {
        const startDate = new Date(dateFilter.value.start);
        const endDate = new Date(dateFilter.value.end);
        if (endDate < startDate) {
            dateFilterError.value = '종료일은 시작일보다 빠를 수 없습니다.';
            return;
        }
    }
    dateFilterError.value = '';
    appliedDateFilter.value.start = dateFilter.value.start;
    appliedDateFilter.value.end = dateFilter.value.end;
    resetInfiniteScroll(); // 필터 적용 시 무한 스크롤 초기화
};
// 날짜 필터 초기화
const resetDateFilter = () => {
    dateFilter.value.start = '';
    dateFilter.value.end = '';
    appliedDateFilter.value.start = '';
    appliedDateFilter.value.end = '';
    dateFilterError.value = '';
    resetInfiniteScroll();
};
// 기분 필터 변경
const changeMoodFilter = (mood) => {
    // 이미 선택된 기분을 다시 클릭하면 전체 보기로 돌아감
    if (selectedMood.value === mood) {
        selectedMood.value = 'all';
    }
    else {
        selectedMood.value = mood;
    }
    resetInfiniteScroll();
};
// 정렬 변경
const changeSortOption = (event) => {
    const select = event.target;
    sortOption.value = select.value;
    resetInfiniteScroll();
};
// 모든 필터 초기화
const resetAllFilters = () => {
    resetDateFilter();
    selectedMood.value = 'all';
    sortOption.value = 'newest';
    resetInfiniteScroll();
};
// 무한 스크롤 초기화
const resetInfiniteScroll = () => {
    currentPage.value = 1;
    hasMoreData.value = true;
};
// 더 많은 데이터 로드
const loadMoreData = () => {
    if (isLoading.value || !hasMoreData.value)
        return;
    isLoading.value = true;
    // 데이터 로드 시뮬레이션 (실제로는 API 호출 등이 있을 수 있음)
    setTimeout(() => {
        const totalItems = filteredDiaries.value.length;
        const loadedItems = currentPage.value * itemsPerPage;
        if (loadedItems >= totalItems) {
            hasMoreData.value = false;
        }
        else {
            currentPage.value++;
        }
        isLoading.value = false;
    }, 500);
};
// 무한 스크롤 관찰자 설정
const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading.value && hasMoreData.value) {
            loadMoreData();
        }
    }, { threshold: 0.5 });
    if (loadingTriggerRef.value) {
        observer.value.observe(loadingTriggerRef.value);
    }
};
// 일기 상세보기로 이동
const viewDiary = (id) => {
    router.push(`/diary/${id}`);
};
// 새 일기 작성 페이지로 이동
const goToWrite = () => {
    router.push('/diary-write');
};
// 일기 데이터 로드
const loadDiaryData = async () => {
    try {
        await diaryStore.fetchDiaries();
        setupIntersectionObserver();
    }
    catch (error) {
        console.error('일기 목록 로딩 실패:', error);
    }
};
// 일기 수정 모달 열기
const openEditModal = (diary) => {
    currentEditDiary.value = diary;
    showEditModal.value = true;
    closeDropdown();
};
// 일기 수정 저장
const saveDiaryEdit = (updatedDiary) => {
    diaryStore.updateDiary(updatedDiary);
    showEditModal.value = false;
    currentEditDiary.value = null;
};
// 일기 삭제 확인 모달 열기
const confirmDelete = (id) => {
    diaryToDelete.value = id;
    showDeleteConfirm.value = true;
    closeDropdown();
};
// 일기 삭제 실행
const deleteDiary = () => {
    if (diaryToDelete.value) {
        diaryStore.deleteDiary(diaryToDelete.value);
        showDeleteConfirm.value = false;
        diaryToDelete.value = null;
    }
};
// 드롭다운 메뉴 토글
const toggleDropdown = (id, event) => {
    event.stopPropagation();
    if (openDropdownId.value === id) {
        openDropdownId.value = null;
    }
    else {
        openDropdownId.value = id;
    }
};
// 드롭다운 메뉴 닫기
const closeDropdown = () => {
    openDropdownId.value = null;
};
// 외부 클릭 시 드롭다운 닫기
const handleOutsideClick = (event) => {
    if (openDropdownId.value !== null) {
        const target = event.target;
        if (!target.closest('.dropdown-menu') &&
            !target.closest('.dropdown-trigger')) {
            openDropdownId.value = null;
        }
    }
};
onMounted(async () => {
    await loadDiaryData();
    document.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
    if (observer.value && loadingTriggerRef.value) {
        observer.value.unobserve(loadingTriggerRef.value);
        observer.value.disconnect();
    }
    document.removeEventListener('click', handleOutsideClick);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "container mx-auto px-4 py-8" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center mb-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "inline-block relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-4xl font-bold text-dang-primary relative z-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute -bottom-3 left-0 right-0 h-3 bg-chart-category3 opacity-30 rounded-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute -top-6 -left-8 text-chart-category3 opacity-30 transform rotate-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute -bottom-6 -right-8 text-chart-category3 opacity-30 transform -rotate-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-3 text-dang-secondary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goToWrite) },
    ...{ class: "bg-dang-primary text-white px-5 py-2 rounded-lg hover:bg-dang-secondary transition-colors flex items-center shadow-dang-md" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "mr-1" },
});
if (__VLS_ctx.diaryStore.diaries.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-16 bg-dang-background rounded-xl shadow-dang-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2370&auto=format&fit=crop",
        alt: "강아지",
        ...{ class: "w-48 h-48 object-cover rounded-full mx-auto opacity-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xl text-_black mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-dang-secondary mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goToWrite) },
        ...{ class: "inline-block bg-dang-primary text-white px-6 py-3 rounded-lg hover:bg-dang-secondary transition-colors shadow-dang-md" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-background p-5 rounded-lg shadow-dang-sm mb-6 border border-dang-light" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-sm font-medium text-dang-secondary mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm text-dang-secondary mr-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (__VLS_ctx.handleStartDateChange) },
        type: "date",
        ...{ class: "border border-dang-light rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary" },
    });
    (__VLS_ctx.dateFilter.start);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "text-sm text-dang-secondary mr-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "date",
        min: (__VLS_ctx.dateFilter.start || undefined),
        ...{ class: "border border-dang-light rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary" },
    });
    (__VLS_ctx.dateFilter.end);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.applyDateFilter) },
        ...{ class: "bg-dang-primary bg-opacity-10 text-dang-secondary px-3 py-1 rounded-md text-sm hover:bg-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.resetDateFilter) },
        ...{ class: "bg-dang-light text-dang-secondary px-3 py-1 rounded-md text-sm hover:bg-dang-pending" },
    });
    if (__VLS_ctx.dateFilterError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-2 text-dang-rejected-text text-xs" },
        });
        (__VLS_ctx.dateFilterError);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col md:flex-row md:justify-between md:items-center gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-sm font-medium text-dang-secondary mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                    return;
                __VLS_ctx.changeMoodFilter('all');
            } },
        ...{ class: "px-3 py-1 rounded-full text-sm font-medium" },
        ...{ class: (__VLS_ctx.selectedMood === 'all'
                ? 'bg-dang-primary text-white'
                : 'bg-dang-primary bg-opacity-10 text-dang-secondary hover:bg-opacity-20') },
    });
    for (const [mood] of __VLS_getVForSourceType((__VLS_ctx.moodOptions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                        return;
                    __VLS_ctx.changeMoodFilter(mood);
                } },
            key: (mood),
            ...{ class: "px-3 py-1 rounded-full text-sm font-medium flex items-center" },
            ...{ class: (__VLS_ctx.selectedMood === mood
                    ? 'bg-dang-primary text-white'
                    : 'bg-dang-light text-dang-secondary hover:bg-dang-pending') },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "mr-1" },
        });
        (__VLS_ctx.getMoodEmoji(mood).split(' ')[0]);
        (__VLS_ctx.getMoodEmoji(mood).split(' ')[1]);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm text-dang-secondary mr-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        ...{ onChange: (__VLS_ctx.changeSortOption) },
        value: (__VLS_ctx.sortOption),
        ...{ class: "bg-dang-light border-0 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-dang-primary" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "newest",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "oldest",
    });
    if (__VLS_ctx.filteredDiaries.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center py-10 bg-dang-background rounded-xl shadow-dang-sm" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xl text-dang-primary mb-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-dang-secondary mb-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.resetAllFilters) },
            ...{ class: "inline-block bg-dang-primary text-white px-6 py-2 rounded-lg hover:bg-dang-secondary transition-colors shadow-dang-md" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-1 md:grid-cols-12 gap-6" },
        });
        if (__VLS_ctx.visibleDiaries.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "md:col-span-8 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 group border border-dang-light relative" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "relative h-80" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.visibleDiaries[0].imageUrl ||
                    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2376&auto=format&fit=crop'),
                alt: (`${__VLS_ctx.formatDate(__VLS_ctx.visibleDiaries[0].date)} 일기 이미지`),
                ...{ class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute bottom-0 left-0 p-6 text-white" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex gap-2 mb-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "px-3 py-1 bg-dang-primary/80 rounded-full text-sm backdrop-blur-sm" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mr-1" },
            });
            (__VLS_ctx.getMoodEmoji(__VLS_ctx.visibleDiaries[0].mood).split(' ')[0]);
            (__VLS_ctx.getMoodEmoji(__VLS_ctx.visibleDiaries[0].mood).split(' ')[1]);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "px-3 py-1 bg-chart-category3/80 rounded-full text-sm backdrop-blur-sm" },
            });
            (__VLS_ctx.getWeatherEmoji(__VLS_ctx.visibleDiaries[0].weather));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
                ...{ class: "text-2xl font-bold mb-1" },
            });
            (__VLS_ctx.formatDate(__VLS_ctx.visibleDiaries[0].date));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "line-clamp-2 text-_gray-100" },
            });
            (__VLS_ctx.visibleDiaries[0].content);
            if (__VLS_ctx.visibleDiaries[0].memory) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "absolute top-4 right-4 bg-dang-primary/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "mr-1" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute top-4 left-4 z-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredDiaries.length === 0))
                            return;
                        if (!(__VLS_ctx.visibleDiaries.length > 0))
                            return;
                        __VLS_ctx.toggleDropdown(__VLS_ctx.visibleDiaries[0].id, $event);
                    } },
                ...{ class: "p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger" },
            });
            const __VLS_0 = {}.MoreVertical;
            /** @type {[typeof __VLS_components.MoreVertical, ]} */ ;
            // @ts-ignore
            const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
                ...{ class: "w-5 h-5" },
            }));
            const __VLS_2 = __VLS_1({
                ...{ class: "w-5 h-5" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_1));
            if (__VLS_ctx.openDropdownId === __VLS_ctx.visibleDiaries[0].id) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                return;
                            if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                return;
                            if (!(__VLS_ctx.visibleDiaries.length > 0))
                                return;
                            if (!(__VLS_ctx.openDropdownId === __VLS_ctx.visibleDiaries[0].id))
                                return;
                            __VLS_ctx.openEditModal(__VLS_ctx.visibleDiaries[0]);
                        } },
                    ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors" },
                });
                const __VLS_4 = {}.Edit;
                /** @type {[typeof __VLS_components.Edit, ]} */ ;
                // @ts-ignore
                const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
                    ...{ class: "w-4 h-4" },
                }));
                const __VLS_6 = __VLS_5({
                    ...{ class: "w-4 h-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_5));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                return;
                            if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                return;
                            if (!(__VLS_ctx.visibleDiaries.length > 0))
                                return;
                            if (!(__VLS_ctx.openDropdownId === __VLS_ctx.visibleDiaries[0].id))
                                return;
                            __VLS_ctx.confirmDelete(__VLS_ctx.visibleDiaries[0].id);
                        } },
                    ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors" },
                });
                const __VLS_8 = {}.Trash2;
                /** @type {[typeof __VLS_components.Trash2, ]} */ ;
                // @ts-ignore
                const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                    ...{ class: "w-4 h-4" },
                }));
                const __VLS_10 = __VLS_9({
                    ...{ class: "w-4 h-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_9));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredDiaries.length === 0))
                            return;
                        if (!(__VLS_ctx.visibleDiaries.length > 0))
                            return;
                        __VLS_ctx.viewDiary(__VLS_ctx.visibleDiaries[0].id);
                    } },
                ...{ class: "absolute inset-0 cursor-pointer z-10" },
            });
        }
        if (__VLS_ctx.visibleDiaries.length > 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "md:col-span-4 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 group border border-dang-light relative" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "relative h-80" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.visibleDiaries[1].imageUrl ||
                    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=2376&auto=format&fit=crop'),
                alt: (`${__VLS_ctx.formatDate(__VLS_ctx.visibleDiaries[1].date)} 일기 이미지`),
                ...{ class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute bottom-0 left-0 p-4 text-white" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex gap-2 mb-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "px-2 py-1 bg-dang-primary/80 rounded-full text-xs backdrop-blur-sm" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mr-1" },
            });
            (__VLS_ctx.getMoodEmoji(__VLS_ctx.visibleDiaries[1].mood).split(' ')[0]);
            (__VLS_ctx.getMoodEmoji(__VLS_ctx.visibleDiaries[1].mood).split(' ')[1]);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "px-2 py-1 bg-chart-category3/80 rounded-full text-xs backdrop-blur-sm" },
            });
            (__VLS_ctx.getWeatherEmoji(__VLS_ctx.visibleDiaries[1].weather));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
                ...{ class: "text-xl font-bold mb-1" },
            });
            (__VLS_ctx.formatDate(__VLS_ctx.visibleDiaries[1].date));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "line-clamp-2 text-sm text-_gray-100" },
            });
            (__VLS_ctx.visibleDiaries[1].content);
            if (__VLS_ctx.visibleDiaries[1].memory) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "absolute top-4 right-4 bg-dang-primary/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "mr-1" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "absolute top-4 left-4 z-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredDiaries.length === 0))
                            return;
                        if (!(__VLS_ctx.visibleDiaries.length > 1))
                            return;
                        __VLS_ctx.toggleDropdown(__VLS_ctx.visibleDiaries[1].id, $event);
                    } },
                ...{ class: "p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger" },
            });
            const __VLS_12 = {}.MoreVertical;
            /** @type {[typeof __VLS_components.MoreVertical, ]} */ ;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
                ...{ class: "w-5 h-5" },
            }));
            const __VLS_14 = __VLS_13({
                ...{ class: "w-5 h-5" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            if (__VLS_ctx.openDropdownId === __VLS_ctx.visibleDiaries[1].id) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                return;
                            if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                return;
                            if (!(__VLS_ctx.visibleDiaries.length > 1))
                                return;
                            if (!(__VLS_ctx.openDropdownId === __VLS_ctx.visibleDiaries[1].id))
                                return;
                            __VLS_ctx.openEditModal(__VLS_ctx.visibleDiaries[1]);
                        } },
                    ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors" },
                });
                const __VLS_16 = {}.Edit;
                /** @type {[typeof __VLS_components.Edit, ]} */ ;
                // @ts-ignore
                const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
                    ...{ class: "w-4 h-4" },
                }));
                const __VLS_18 = __VLS_17({
                    ...{ class: "w-4 h-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_17));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                return;
                            if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                return;
                            if (!(__VLS_ctx.visibleDiaries.length > 1))
                                return;
                            if (!(__VLS_ctx.openDropdownId === __VLS_ctx.visibleDiaries[1].id))
                                return;
                            __VLS_ctx.confirmDelete(__VLS_ctx.visibleDiaries[1].id);
                        } },
                    ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors" },
                });
                const __VLS_20 = {}.Trash2;
                /** @type {[typeof __VLS_components.Trash2, ]} */ ;
                // @ts-ignore
                const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
                    ...{ class: "w-4 h-4" },
                }));
                const __VLS_22 = __VLS_21({
                    ...{ class: "w-4 h-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_21));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredDiaries.length === 0))
                            return;
                        if (!(__VLS_ctx.visibleDiaries.length > 1))
                            return;
                        __VLS_ctx.viewDiary(__VLS_ctx.visibleDiaries[1].id);
                    } },
                ...{ class: "absolute inset-0 cursor-pointer z-10" },
            });
        }
        for (const [diary] of __VLS_getVForSourceType((__VLS_ctx.visibleDiaries.slice(2)))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (diary.id),
                ...{ class: "md:col-span-4 bg-dang-background rounded-xl shadow-dang-md overflow-hidden hover:shadow-dang-lg transition-duration-300 border border-dang-light relative" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex flex-col h-full" },
            });
            if (diary.imageUrl) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "h-48 overflow-hidden relative" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    src: (diary.imageUrl),
                    alt: (`${__VLS_ctx.formatDate(diary.date)} 일기 이미지`),
                    ...{ class: "w-full h-full object-cover hover:scale-105 transition-transform duration-500" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "absolute top-4 left-4 z-20" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                return;
                            if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                return;
                            if (!(diary.imageUrl))
                                return;
                            __VLS_ctx.toggleDropdown(diary.id, $event);
                        } },
                    ...{ class: "p-2 bg-white/80 hover:bg-white rounded-full text-dang-secondary hover:text-dang-primary transition-colors backdrop-blur-sm dropdown-trigger" },
                });
                const __VLS_24 = {}.MoreVertical;
                /** @type {[typeof __VLS_components.MoreVertical, ]} */ ;
                // @ts-ignore
                const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
                    ...{ class: "w-5 h-5" },
                }));
                const __VLS_26 = __VLS_25({
                    ...{ class: "w-5 h-5" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_25));
                if (__VLS_ctx.openDropdownId === diary.id) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                    return;
                                if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                    return;
                                if (!(diary.imageUrl))
                                    return;
                                if (!(__VLS_ctx.openDropdownId === diary.id))
                                    return;
                                __VLS_ctx.openEditModal(diary);
                            } },
                        ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors" },
                    });
                    const __VLS_28 = {}.Edit;
                    /** @type {[typeof __VLS_components.Edit, ]} */ ;
                    // @ts-ignore
                    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
                        ...{ class: "w-4 h-4" },
                    }));
                    const __VLS_30 = __VLS_29({
                        ...{ class: "w-4 h-4" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                    return;
                                if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                    return;
                                if (!(diary.imageUrl))
                                    return;
                                if (!(__VLS_ctx.openDropdownId === diary.id))
                                    return;
                                __VLS_ctx.confirmDelete(diary.id);
                            } },
                        ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors" },
                    });
                    const __VLS_32 = {}.Trash2;
                    /** @type {[typeof __VLS_components.Trash2, ]} */ ;
                    // @ts-ignore
                    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                        ...{ class: "w-4 h-4" },
                    }));
                    const __VLS_34 = __VLS_33({
                        ...{ class: "w-4 h-4" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                }
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-5 flex-grow flex flex-col relative" },
            });
            if (!diary.imageUrl) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "absolute top-4 left-4 z-20" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                return;
                            if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                return;
                            if (!(!diary.imageUrl))
                                return;
                            __VLS_ctx.toggleDropdown(diary.id, $event);
                        } },
                    ...{ class: "p-2 bg-dang-light hover:bg-dang-pending rounded-full text-dang-secondary hover:text-dang-primary transition-colors dropdown-trigger" },
                });
                const __VLS_36 = {}.MoreVertical;
                /** @type {[typeof __VLS_components.MoreVertical, ]} */ ;
                // @ts-ignore
                const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
                    ...{ class: "w-5 h-5" },
                }));
                const __VLS_38 = __VLS_37({
                    ...{ class: "w-5 h-5" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                if (__VLS_ctx.openDropdownId === diary.id) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "absolute top-full left-0 mt-1 bg-white rounded-lg shadow-dang-md py-1 w-32 dropdown-menu" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                    return;
                                if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                    return;
                                if (!(!diary.imageUrl))
                                    return;
                                if (!(__VLS_ctx.openDropdownId === diary.id))
                                    return;
                                __VLS_ctx.openEditModal(diary);
                            } },
                        ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-dang-light text-dang-secondary hover:text-dang-primary transition-colors" },
                    });
                    const __VLS_40 = {}.Edit;
                    /** @type {[typeof __VLS_components.Edit, ]} */ ;
                    // @ts-ignore
                    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
                        ...{ class: "w-4 h-4" },
                    }));
                    const __VLS_42 = __VLS_41({
                        ...{ class: "w-4 h-4" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                                    return;
                                if (!!(__VLS_ctx.filteredDiaries.length === 0))
                                    return;
                                if (!(!diary.imageUrl))
                                    return;
                                if (!(__VLS_ctx.openDropdownId === diary.id))
                                    return;
                                __VLS_ctx.confirmDelete(diary.id);
                            } },
                        ...{ class: "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-500 transition-colors" },
                    });
                    const __VLS_44 = {}.Trash2;
                    /** @type {[typeof __VLS_components.Trash2, ]} */ ;
                    // @ts-ignore
                    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
                        ...{ class: "w-4 h-4" },
                    }));
                    const __VLS_46 = __VLS_45({
                        ...{ class: "w-4 h-4" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                }
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex justify-between items-start mb-3" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: "font-bold text-lg text-dang-primary" },
            });
            (__VLS_ctx.formatDate(diary.date));
            if (diary.memory) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "bg-dang-primary bg-opacity-10 text-dang-primary px-2 py-1 rounded-full text-xs flex items-center" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "mr-1" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex flex-wrap gap-2 mb-3" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-xs px-2 py-1 bg-dang-primary bg-opacity-10 rounded-full" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mr-1" },
            });
            (__VLS_ctx.getMoodEmoji(diary.mood).split(' ')[0]);
            (__VLS_ctx.getMoodEmoji(diary.mood).split(' ')[1]);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-xs px-2 py-1 bg-dang-light rounded-full" },
            });
            (__VLS_ctx.getWeatherEmoji(diary.weather));
            if (diary.walkTime) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "text-xs px-2 py-1 bg-dang-light rounded-full" },
                });
                (diary.walkTime);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-_black line-clamp-3 mb-3 text-sm flex-grow" },
            });
            (diary.content);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex justify-between items-center mt-auto pt-2 border-t border-dang-light" },
            });
            if (diary.mealTime) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "text-xs text-dang-secondary" },
                });
                (diary.mealTime);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredDiaries.length === 0))
                            return;
                        __VLS_ctx.viewDiary(diary.id);
                    } },
                ...{ class: "text-dang-primary text-xs hover:opacity-80" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.diaryStore.diaries.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredDiaries.length === 0))
                            return;
                        __VLS_ctx.viewDiary(diary.id);
                    } },
                ...{ class: "absolute inset-0 cursor-pointer z-10" },
            });
        }
        if (__VLS_ctx.filteredDiaries.length > __VLS_ctx.visibleDiaries.length || __VLS_ctx.isLoading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ref: "loadingTriggerRef",
                ...{ class: "mt-8 text-center py-4" },
            });
            /** @type {typeof __VLS_ctx.loadingTriggerRef} */ ;
            if (__VLS_ctx.isLoading) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "flex justify-center items-center space-x-2" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "w-3 h-3 rounded-full bg-dang-primary animate-bounce" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "w-3 h-3 rounded-full bg-dang-primary animate-bounce" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "w-3 h-3 rounded-full bg-dang-primary animate-bounce" },
                    ...{ style: {} },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "text-dang-secondary" },
                });
            }
        }
        if (!__VLS_ctx.hasMoreData &&
            __VLS_ctx.visibleDiaries.length > 0 &&
            __VLS_ctx.visibleDiaries.length === __VLS_ctx.filteredDiaries.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mt-8 text-center py-4 border-t border-dang-light" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-dang-secondary" },
            });
        }
    }
}
/** @type {[typeof DiaryEditModal, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(DiaryEditModal, new DiaryEditModal({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    show: (__VLS_ctx.showEditModal),
    diary: (__VLS_ctx.currentEditDiary),
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    show: (__VLS_ctx.showEditModal),
    diary: (__VLS_ctx.currentEditDiary),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
let __VLS_53;
const __VLS_54 = {
    onClose: (...[$event]) => {
        __VLS_ctx.showEditModal = false;
    }
};
const __VLS_55 = {
    onSave: (__VLS_ctx.saveDiaryEdit)
};
var __VLS_50;
if (__VLS_ctx.showDeleteConfirm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: () => { } },
        ...{ class: "bg-white rounded-xl shadow-dang-lg p-6 max-w-md w-full mx-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-xl font-bold text-dang-primary mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-dang-secondary mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showDeleteConfirm))
                    return;
                __VLS_ctx.showDeleteConfirm = false;
            } },
        ...{ class: "px-4 py-2 border border-dang-light rounded-md hover:bg-dang-light text-dang-secondary transition-colors" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.deleteDiary) },
        ...{ class: "px-4 py-2 bg-dang-rejected text-black rounded-md hover:bg-opacity-80 transition-colors" },
    });
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[length:20px_20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-bottom-3']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-6']} */ ;
/** @type {__VLS_StyleScopedClasses['-left-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-12']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-bottom-6']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_black']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-pending']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-rejected-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['md:justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['md:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-dang-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-t']} */ ;
/** @type {__VLS_StyleScopedClasses['from-black/70']} */ ;
/** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary/90']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-dang-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-t']} */ ;
/** @type {__VLS_StyleScopedClasses['from-black/70']} */ ;
/** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary/90']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-dang-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-pending']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-md']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_black']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-rejected']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formatDate: formatDate,
            getMoodEmoji: getMoodEmoji,
            getWeatherEmoji: getWeatherEmoji,
            DiaryEditModal: DiaryEditModal,
            Edit: Edit,
            Trash2: Trash2,
            MoreVertical: MoreVertical,
            diaryStore: diaryStore,
            dateFilter: dateFilter,
            dateFilterError: dateFilterError,
            selectedMood: selectedMood,
            sortOption: sortOption,
            isLoading: isLoading,
            hasMoreData: hasMoreData,
            loadingTriggerRef: loadingTriggerRef,
            showEditModal: showEditModal,
            currentEditDiary: currentEditDiary,
            showDeleteConfirm: showDeleteConfirm,
            openDropdownId: openDropdownId,
            moodOptions: moodOptions,
            filteredDiaries: filteredDiaries,
            visibleDiaries: visibleDiaries,
            handleStartDateChange: handleStartDateChange,
            applyDateFilter: applyDateFilter,
            resetDateFilter: resetDateFilter,
            changeMoodFilter: changeMoodFilter,
            changeSortOption: changeSortOption,
            resetAllFilters: resetAllFilters,
            viewDiary: viewDiary,
            goToWrite: goToWrite,
            openEditModal: openEditModal,
            saveDiaryEdit: saveDiaryEdit,
            confirmDelete: confirmDelete,
            deleteDiary: deleteDiary,
            toggleDropdown: toggleDropdown,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
