import { ref, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profileStore';
import { UserCircle, Brain, Pencil } from 'lucide-vue-next';
import ProfileInfo from '@/components/profile/ProfileInfo.vue';
import DBTICard from '@/components/profile/DBTICard.vue';
import PetsitterGuideCard from '@/components/profile/PetsitterGuideCard.vue';
import AddPetModal from '@/components/modals/AddPetModal.vue';
import ResultModal from '@/components/modals/ResultModal.vue';
import PetSelector from '@/components/profile/PetSelector.vue';
import FeatureCard from '@/components/profile/FeatureCard.vue';
import defaultProfileImage from '@/assets/svgs/profile.svg';
import html2pdf from 'html2pdf.js';
const profileStore = useProfileStore();
// 모달 상태
const showAddPetModal = ref(false);
const showDBTIResultModal = ref(false);
const showPetsitterGuideModal = ref(false);
// 현재 선택된 반려동물 인덱스
const currentPetIndex = ref(0);
// 반려동물 목록 (예시 데이터)
const pets = ref([
    {
        id: 1,
        name: '멍멍이',
        breed: '골든 리트리버',
        age: 3,
        gender: 'male',
        weight: 30,
        neutered: true,
        imageUrl: defaultProfileImage,
        dbtiResult: null,
        petsitterGuide: null,
    },
    {
        id: 2,
        name: '냥냥이',
        breed: '페르시안',
        age: 2,
        gender: 'female',
        weight: 4,
        neutered: true,
        imageUrl: defaultProfileImage,
        dbtiResult: null,
        petsitterGuide: null,
    },
]);
// 반려동물 전환 함수
const switchPet = (index) => {
    currentPetIndex.value = index;
    profileStore.setProfile(pets.value[index]);
};
// 반려동물 추가 함수
const addPet = (newPet) => {
    newPet.id = pets.value.length + 1;
    pets.value.push(newPet);
    switchPet(pets.value.length - 1);
    profileStore.setProfile(newPet);
};
onMounted(async () => {
    try {
        await profileStore.fetchProfile();
    }
    catch (error) {
        console.error('프로필 로딩 실패:', error);
    }
});
const updateProfile = (updatedProfile) => {
    profileStore.updateProfile(updatedProfile);
    // 현재 반려동물 정보 업데이트
    pets.value[currentPetIndex.value] = updatedProfile;
};
const analyzeDogPersonality = async () => {
    try {
        await profileStore.analyzeDogPersonality();
        // 현재 반려동물 정보 업데이트
        pets.value[currentPetIndex.value].dbtiResult =
            profileStore.profile.dbtiResult;
    }
    catch (error) {
        console.error('DBTI 분석 실패:', error);
    }
};
const generatePetsitterGuide = async () => {
    try {
        await profileStore.generatePetsitterGuide();
        // 현재 반려동물 정보 업데이트
        pets.value[currentPetIndex.value].petsitterGuide =
            profileStore.profile.petsitterGuide;
    }
    catch (error) {
        console.error('펫시터 가이드 생성 실패:', error);
    }
};
// 모달 관련 함수들
const showDBTIResult = () => {
    showDBTIResultModal.value = true;
};
const showPetsitterGuide = () => {
    showPetsitterGuideModal.value = true;
};
const handleSavePdf = () => {
    const el = document.getElementById('pdf-target');
    if (!el)
        return;
    html2pdf()
        .set({
        margin: 10,
        filename: '댕댕로그-분석결과.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
        .from(el)
        .save();
};
const handleShareKakao = () => {
    // 카카오 SDK가 로드되었는지 확인
    if (!window.Kakao) {
        alert('카카오톡 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
        return;
    }
    // 카카오 SDK 초기화가 필요한 경우 (한 번만 호출해야 함)
    if (!window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
    const petName = pets.value[currentPetIndex.value].name;
    const resultTitle = showDBTIResultModal.value
        ? 'DBTI 분석 결과'
        : '펫시터 가이드';
    const resultDescription = showDBTIResultModal.value
        ? pets.value[currentPetIndex.value].dbtiResult?.description ||
            'DBTI 분석 결과'
        : pets.value[currentPetIndex.value].petsitterGuide?.generalInfo ||
            '펫시터 가이드';
    // 카카오 공유하기 API 호출
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: `${petName}의 ${resultTitle}`,
            description: resultDescription,
            imageUrl: '@/assets/svgs/logo.svg', // 대표 이미지 URL로 변경 필요
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        buttons: [
            {
                title: '결과 확인하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
};
const handleCopyLink = () => {
    // 현재 페이지 URL을 클립보드에 복사
    navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
        alert('URL이 클립보드에 복사되었습니다.');
    })
        .catch((err) => {
        console.error('URL 복사 실패:', err);
        alert('URL 복사에 실패했습니다.');
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-dang-light py-12 bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)] bg-[length:20px_20px]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-7xl w-full bg-dang-background rounded-2xl p-8 shadow-dang-lg relative border-t-4 border-dang-primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-8" },
});
/** @type {[typeof PetSelector, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PetSelector, new PetSelector({
    ...{ 'onSwitch': {} },
    ...{ 'onAdd': {} },
    pets: (__VLS_ctx.pets),
    currentPetIndex: (__VLS_ctx.currentPetIndex),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onSwitch': {} },
    ...{ 'onAdd': {} },
    pets: (__VLS_ctx.pets),
    currentPetIndex: (__VLS_ctx.currentPetIndex),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onSwitch: (__VLS_ctx.switchPet)
};
const __VLS_7 = {
    onAdd: (...[$event]) => {
        __VLS_ctx.showAddPetModal = true;
    }
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overflow-x-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-3 gap-6 min-w-[56.25rem]" },
});
/** @type {[typeof FeatureCard, typeof FeatureCard, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(FeatureCard, new FeatureCard({
    icon: (__VLS_ctx.UserCircle),
    title: "반려동물 정보",
    color: "dang-primary",
}));
const __VLS_9 = __VLS_8({
    icon: (__VLS_ctx.UserCircle),
    title: "반려동물 정보",
    color: "dang-primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
/** @type {[typeof ProfileInfo, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(ProfileInfo, new ProfileInfo({
    ...{ 'onUpdate:profile': {} },
    profile: (__VLS_ctx.pets[__VLS_ctx.currentPetIndex]),
}));
const __VLS_12 = __VLS_11({
    ...{ 'onUpdate:profile': {} },
    profile: (__VLS_ctx.pets[__VLS_ctx.currentPetIndex]),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_14;
let __VLS_15;
let __VLS_16;
const __VLS_17 = {
    'onUpdate:profile': (__VLS_ctx.updateProfile)
};
var __VLS_13;
var __VLS_10;
/** @type {[typeof FeatureCard, typeof FeatureCard, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(FeatureCard, new FeatureCard({
    icon: (__VLS_ctx.Brain),
    title: "DBTI 분석",
    color: "chart-category2",
}));
const __VLS_19 = __VLS_18({
    icon: (__VLS_ctx.Brain),
    title: "DBTI 분석",
    color: "chart-category2",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
/** @type {[typeof DBTICard, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(DBTICard, new DBTICard({
    ...{ 'onAnalyze': {} },
    ...{ 'onShowResult': {} },
    profile: (__VLS_ctx.pets[__VLS_ctx.currentPetIndex]),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onAnalyze': {} },
    ...{ 'onShowResult': {} },
    profile: (__VLS_ctx.pets[__VLS_ctx.currentPetIndex]),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onAnalyze: (__VLS_ctx.analyzeDogPersonality)
};
const __VLS_28 = {
    onShowResult: (__VLS_ctx.showDBTIResult)
};
var __VLS_23;
var __VLS_20;
/** @type {[typeof FeatureCard, typeof FeatureCard, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(FeatureCard, new FeatureCard({
    icon: (__VLS_ctx.Pencil),
    title: "펫시터 가이드",
    color: "chart-category3",
}));
const __VLS_30 = __VLS_29({
    icon: (__VLS_ctx.Pencil),
    title: "펫시터 가이드",
    color: "chart-category3",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
/** @type {[typeof PetsitterGuideCard, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(PetsitterGuideCard, new PetsitterGuideCard({
    ...{ 'onGenerate': {} },
    ...{ 'onShowGuide': {} },
    profile: (__VLS_ctx.pets[__VLS_ctx.currentPetIndex]),
}));
const __VLS_33 = __VLS_32({
    ...{ 'onGenerate': {} },
    ...{ 'onShowGuide': {} },
    profile: (__VLS_ctx.pets[__VLS_ctx.currentPetIndex]),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_35;
let __VLS_36;
let __VLS_37;
const __VLS_38 = {
    onGenerate: (__VLS_ctx.generatePetsitterGuide)
};
const __VLS_39 = {
    onShowGuide: (__VLS_ctx.showPetsitterGuide)
};
var __VLS_34;
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute bottom-5 left-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 -rotate-15 animate-bounce-custom" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute bottom-5 right-5 w-[3.75rem] h-[3.75rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-30 rotate-15 animate-bounce-delay-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute top-10 right-10 w-[2.5rem] h-[2.5rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 rotate-45 animate-bounce-delay-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute top-20 left-20 w-[2rem] h-[2rem] bg-[url('@/assets/svgs/paw1.svg')] bg-contain bg-no-repeat opacity-20 -rotate-30 animate-bounce-delay-4" },
});
if (__VLS_ctx.showAddPetModal) {
    /** @type {[typeof AddPetModal, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(AddPetModal, new AddPetModal({
        ...{ 'onClose': {} },
        ...{ 'onAdd': {} },
        show: (__VLS_ctx.showAddPetModal),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClose': {} },
        ...{ 'onAdd': {} },
        show: (__VLS_ctx.showAddPetModal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_43;
    let __VLS_44;
    let __VLS_45;
    const __VLS_46 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.showAddPetModal))
                return;
            __VLS_ctx.showAddPetModal = false;
        }
    };
    const __VLS_47 = {
        onAdd: (__VLS_ctx.addPet)
    };
    var __VLS_42;
}
/** @type {[typeof ResultModal, typeof ResultModal, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(ResultModal, new ResultModal({
    ...{ 'onClose': {} },
    ...{ 'onSavePdf': {} },
    ...{ 'onShareKakao': {} },
    ...{ 'onCopyLink': {} },
    show: (__VLS_ctx.showDBTIResultModal),
    title: "DBTI 분석 결과",
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClose': {} },
    ...{ 'onSavePdf': {} },
    ...{ 'onShareKakao': {} },
    ...{ 'onCopyLink': {} },
    show: (__VLS_ctx.showDBTIResultModal),
    title: "DBTI 분석 결과",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
let __VLS_53;
const __VLS_54 = {
    onClose: (...[$event]) => {
        __VLS_ctx.showDBTIResultModal = false;
    }
};
const __VLS_55 = {
    onSavePdf: (__VLS_ctx.handleSavePdf)
};
const __VLS_56 = {
    onShareKakao: (__VLS_ctx.handleShareKakao)
};
const __VLS_57 = {
    onCopyLink: (__VLS_ctx.handleCopyLink)
};
__VLS_50.slots.default;
if (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].dbtiResult) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "inline-block p-4 bg-chart-category2 bg-opacity-20 rounded-full mb-4" },
    });
    const __VLS_58 = {}.Brain;
    /** @type {[typeof __VLS_components.Brain, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        ...{ class: "w-12 h-12 text-chart-category2" },
    }));
    const __VLS_60 = __VLS_59({
        ...{ class: "w-12 h-12 text-chart-category2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-2xl font-bold text-chart-category2" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].dbtiResult?.type);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-lg text-_gray-500 mt-2" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-chart-category2 bg-opacity-10 rounded-xl p-6 border border-chart-category2 border-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold text-chart-category2 mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-_gray-700 leading-relaxed text-lg" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].dbtiResult?.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-light rounded-xl p-5 border border-chart-category2 border-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-bold text-chart-category2 mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "space-y-2 text-_gray-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ class: "flex items-start gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ class: "flex items-start gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ class: "flex items-start gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block w-2 h-2 rounded-full bg-chart-category2 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-light rounded-xl p-5 border border-chart-category3 border-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-bold text-chart-category3 mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "space-y-2 text-_gray-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ class: "flex items-start gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ class: "flex items-start gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        ...{ class: "flex items-start gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-block w-2 h-2 rounded-full bg-chart-category3 mt-2" },
    });
}
var __VLS_50;
/** @type {[typeof ResultModal, typeof ResultModal, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(ResultModal, new ResultModal({
    ...{ 'onClose': {} },
    ...{ 'onSavePdf': {} },
    ...{ 'onShareKakao': {} },
    ...{ 'onCopyLink': {} },
    show: (__VLS_ctx.showPetsitterGuideModal),
    title: "펫시터 가이드",
}));
const __VLS_63 = __VLS_62({
    ...{ 'onClose': {} },
    ...{ 'onSavePdf': {} },
    ...{ 'onShareKakao': {} },
    ...{ 'onCopyLink': {} },
    show: (__VLS_ctx.showPetsitterGuideModal),
    title: "펫시터 가이드",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    onClose: (...[$event]) => {
        __VLS_ctx.showPetsitterGuideModal = false;
    }
};
const __VLS_69 = {
    onSavePdf: (__VLS_ctx.handleSavePdf)
};
const __VLS_70 = {
    onShareKakao: (__VLS_ctx.handleShareKakao)
};
const __VLS_71 = {
    onCopyLink: (__VLS_ctx.handleCopyLink)
};
__VLS_64.slots.default;
if (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].petsitterGuide) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "inline-block p-4 bg-chart-category3 bg-opacity-20 rounded-full mb-4" },
    });
    const __VLS_72 = {}.Pencil;
    /** @type {[typeof __VLS_components.Pencil, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ class: "w-12 h-12 text-chart-category3" },
    }));
    const __VLS_74 = __VLS_73({
        ...{ class: "w-12 h-12 text-chart-category3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-2xl font-bold text-chart-category3" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-lg text-_gray-500 mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-chart-category3 bg-opacity-10 rounded-xl p-6 border border-chart-category3 border-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold text-chart-category3 mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-_gray-700 leading-relaxed text-lg" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].petsitterGuide?.generalInfo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-light rounded-xl p-6 border border-chart-category4 border-opacity-30" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold text-chart-category4 mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-_gray-700 leading-relaxed" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].petsitterGuide?.routineInfo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-light rounded-xl p-5 border border-chart-category1 border-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-bold text-chart-category1 mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-_gray-600" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].petsitterGuide?.feedingInfo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-light rounded-xl p-5 border border-chart-category5 border-opacity-30" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-bold text-chart-category1 mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-_gray-600" },
    });
    (__VLS_ctx.pets[__VLS_ctx.currentPetIndex].petsitterGuide?.healthInfo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-dang-approved rounded-xl p-6 border border-dang-approved-text border-opacity-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold text-dang-approved-text mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "space-y-2 text-_gray-600" },
    });
    for (const [note, index] of __VLS_getVForSourceType((__VLS_ctx.pets[__VLS_ctx.currentPetIndex].petsitterGuide
        ?.specialNotes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ class: "flex items-start gap-2" },
            key: (index),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "inline-block w-2 h-2 rounded-full bg-dang-rejected-text mt-2" },
        });
        (note);
    }
}
var __VLS_64;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[linear-gradient(#f3f3f3_1px,transparent_1px),linear-gradient(90deg,#f3f3f3_1px,transparent_1px)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[length:20px_20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-dang-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[56.25rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-5']} */ ;
/** @type {__VLS_StyleScopedClasses['left-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[3.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[url(\'@/assets/svgs/paw1.svg\')]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-no-repeat']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-15']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-5']} */ ;
/** @type {__VLS_StyleScopedClasses['right-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[3.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3.75rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[url(\'@/assets/svgs/paw1.svg\')]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-no-repeat']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-15']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-delay-2']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-10']} */ ;
/** @type {__VLS_StyleScopedClasses['right-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[2.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[2.5rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[url(\'@/assets/svgs/paw1.svg\')]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-no-repeat']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-45']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-delay-3']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-20']} */ ;
/** @type {__VLS_StyleScopedClasses['left-20']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[2rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[2rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[url(\'@/assets/svgs/paw1.svg\')]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-no-repeat']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['-rotate-30']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-bounce-delay-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-chart-category5']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-chart-category1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-approved']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dang-approved-text']} */ ;
/** @type {__VLS_StyleScopedClasses['border-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dang-approved-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dang-rejected-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserCircle: UserCircle,
            Brain: Brain,
            Pencil: Pencil,
            ProfileInfo: ProfileInfo,
            DBTICard: DBTICard,
            PetsitterGuideCard: PetsitterGuideCard,
            AddPetModal: AddPetModal,
            ResultModal: ResultModal,
            PetSelector: PetSelector,
            FeatureCard: FeatureCard,
            showAddPetModal: showAddPetModal,
            showDBTIResultModal: showDBTIResultModal,
            showPetsitterGuideModal: showPetsitterGuideModal,
            currentPetIndex: currentPetIndex,
            pets: pets,
            switchPet: switchPet,
            addPet: addPet,
            updateProfile: updateProfile,
            analyzeDogPersonality: analyzeDogPersonality,
            generatePetsitterGuide: generatePetsitterGuide,
            showDBTIResult: showDBTIResult,
            showPetsitterGuide: showPetsitterGuide,
            handleSavePdf: handleSavePdf,
            handleShareKakao: handleShareKakao,
            handleCopyLink: handleCopyLink,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
