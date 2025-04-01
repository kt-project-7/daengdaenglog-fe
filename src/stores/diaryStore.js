import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
export const useDiaryStore = defineStore('diary', () => {
    // 일기 목록
    const diaries = ref([]);
    // 현재 선택된 일기
    const currentDiary = ref(null);
    // 오늘 날짜
    const today = computed(() => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    });
    // 새 일기 폼 초기값
    const getInitialNewDiary = () => ({
        date: today.value,
        mood: '',
        weather: '',
        content: '',
        walkTime: null,
        mealTime: '',
        imageUrl: null,
    });
    // 새 일기 폼
    const newDiary = ref(getInitialNewDiary());
    // 일기 저장
    const saveDiary = () => {
        const id = Date.now().toString();
        const diary = {
            id,
            ...newDiary.value,
            walkTime: newDiary.value.walkTime || undefined,
            imageUrl: newDiary.value.imageUrl || undefined,
            memory: {
                image: {
                    content: newDiary.value.content,
                },
            },
        };
        diaries.value.unshift(diary);
        // 폼 초기화
        newDiary.value = getInitialNewDiary();
        return id;
    };
    // 일기 상세 보기
    const setCurrentDiaryId = (id) => {
        currentDiary.value = diaries.value.find((d) => d.id === id) || null;
    };
    // 추억 생성
    const generateMemory = () => {
        if (!currentDiary.value)
            return;
        const diaryIndex = diaries.value.findIndex((d) => d.id === currentDiary.value?.id);
        if (diaryIndex !== -1) {
            diaries.value[diaryIndex].memory = {
                image: {
                    content: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop',
                },
            };
        }
    };
    // 일기 수정
    const updateDiary = (updatedDiary) => {
        const index = diaries.value.findIndex(diary => diary.id === updatedDiary.id);
        if (index !== -1) {
            diaries.value[index] = updatedDiary;
            // 현재 보고 있는 일기가 수정된 일기라면 현재 일기도 업데이트
            if (currentDiary.value && currentDiary.value.id === updatedDiary.id) {
                currentDiary.value = updatedDiary;
            }
        }
    };
    // 일기 삭제
    const deleteDiary = (id) => {
        diaries.value = diaries.value.filter(diary => diary.id !== id);
        // 현재 보고 있는 일기가 삭제된 일기라면 현재 일기 초기화
        if (currentDiary.value && currentDiary.value.id === id) {
            currentDiary.value = null;
        }
    };
    // 더미 데이터
    const dummyDiaries = [
        {
            id: '1',
            date: '2024-03-20',
            mood: 'happy',
            weather: 'sunny',
            content: '오늘은 정말 좋은 날씨였어요! 공원에서 친구들과 놀았어요.',
            walkTime: 30,
            mealTime: '08:00, 12:00, 18:00',
            imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop',
            memory: {
                image: {
                    content: '공원에서 놀고 있는 모습',
                },
            },
        },
        {
            id: '2',
            date: '2024-03-19',
            mood: 'sleepy',
            weather: 'cloudy',
            content: '오늘은 조금 피곤했어요. 오후에 낮잠을 많이 잤어요.',
            walkTime: 20,
            mealTime: '09:00, 13:00, 19:00',
            imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2370&auto=format&fit=crop',
        },
        {
            id: '3',
            date: '2024-03-18',
            mood: 'love',
            weather: 'sunny',
            content: '주인님과 함께 산책을 했어요. 정말 즐거웠어요!',
            walkTime: 45,
            mealTime: '07:30, 12:30, 18:30',
            imageUrl: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=2370&auto=format&fit=crop',
        },
    ];
    const fetchDiaries = async () => {
        // TODO: API 연동 후 실제 데이터로 교체
        diaries.value = dummyDiaries;
    };
    const fetchDiaryById = async (id) => {
        // TODO: API 연동 후 실제 데이터로 교체
        const diary = dummyDiaries.find((d) => d.id === id);
        if (diary) {
            currentDiary.value = diary;
        }
    };
    const createDiary = async (diary) => {
        // TODO: API 연동 후 실제 데이터로 교체
        const newDiary = {
            id: String(dummyDiaries.length + 1),
            date: diary.date,
            mood: diary.mood,
            weather: diary.weather,
            content: diary.content,
            walkTime: diary.walkTime || undefined,
            mealTime: diary.mealTime,
            imageUrl: diary.imageUrl || undefined,
            memory: {
                image: {
                    content: diary.content,
                },
            },
        };
        dummyDiaries.unshift(newDiary);
        diaries.value = dummyDiaries;
        return newDiary;
    };
    return {
        diaries,
        currentDiary,
        newDiary,
        today,
        saveDiary,
        setCurrentDiaryId,
        generateMemory,
        getInitialNewDiary,
        fetchDiaries,
        fetchDiaryById,
        createDiary,
        updateDiary,
        deleteDiary,
    };
});
