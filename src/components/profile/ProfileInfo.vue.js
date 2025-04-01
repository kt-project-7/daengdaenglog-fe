import { ref } from 'vue';
import { Save, X, Pencil } from 'lucide-vue-next';
import defaultProfileImage from '@/assets/svgs/profile.svg';
import ProfileImageSection from './ProfileImageSection.vue';
import ProfileForm from './ProfileForm.vue';
const props = defineProps();
const emit = defineEmits();
const isEditing = ref(false);
const editedProfile = ref({ ...props.profile });
const toggleEditMode = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
        // 편집 모드 시작 시 현재 프로필 복사
        editedProfile.value = { ...props.profile };
    }
    else {
        // 편집 모드 취소 시 이미지 리셋
        editedProfile.value = { ...props.profile };
    }
};
const updateProfileImage = (imageUrl) => {
    editedProfile.value.imageUrl = imageUrl;
};
const handleFormUpdate = (updates) => {
    editedProfile.value = { ...editedProfile.value, ...updates };
};
const saveChanges = () => {
    const updatedProfile = { ...props.profile, ...editedProfile.value };
    emit('update:profile', updatedProfile);
    isEditing.value = false;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col items-center relative" },
});
/** @type {[typeof ProfileImageSection, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ProfileImageSection, new ProfileImageSection({
    ...{ 'onUpdate:image': {} },
    imageUrl: (__VLS_ctx.profile.imageUrl),
    defaultImage: (__VLS_ctx.defaultProfileImage),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onUpdate:image': {} },
    imageUrl: (__VLS_ctx.profile.imageUrl),
    defaultImage: (__VLS_ctx.defaultProfileImage),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    'onUpdate:image': (__VLS_ctx.updateProfileImage)
};
var __VLS_2;
/** @type {[typeof ProfileForm, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ProfileForm, new ProfileForm({
    ...{ 'onUpdate:profile': {} },
    profile: (__VLS_ctx.isEditing ? __VLS_ctx.editedProfile : __VLS_ctx.profile),
    isEditing: (__VLS_ctx.isEditing),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onUpdate:profile': {} },
    profile: (__VLS_ctx.isEditing ? __VLS_ctx.editedProfile : __VLS_ctx.profile),
    isEditing: (__VLS_ctx.isEditing),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    'onUpdate:profile': (__VLS_ctx.handleFormUpdate)
};
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end gap-4 mt-8 w-full" },
});
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleEditMode) },
        ...{ class: "flex items-center gap-2 px-4 py-2 text-_gray-400 bg-_gray-100 rounded-lg hover:bg-_gray-200 transition-colors" },
    });
    const __VLS_14 = {}.X;
    /** @type {[typeof __VLS_components.X, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
}
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.saveChanges) },
        ...{ class: "flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors" },
    });
    const __VLS_18 = {}.Save;
    /** @type {[typeof __VLS_components.Save, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_20 = __VLS_19({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleEditMode) },
        ...{ class: "flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors" },
    });
    const __VLS_22 = {}.Pencil;
    /** @type {[typeof __VLS_components.Pencil, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_24 = __VLS_23({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-_gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-_gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-_gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary/90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary/90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Save: Save,
            X: X,
            Pencil: Pencil,
            defaultProfileImage: defaultProfileImage,
            ProfileImageSection: ProfileImageSection,
            ProfileForm: ProfileForm,
            isEditing: isEditing,
            editedProfile: editedProfile,
            toggleEditMode: toggleEditMode,
            updateProfileImage: updateProfileImage,
            handleFormUpdate: handleFormUpdate,
            saveChanges: saveChanges,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
