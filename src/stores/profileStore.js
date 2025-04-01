import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useProfileStore = defineStore('profile', () => {
    const profile = ref({
        id: 1,
        name: '',
        breed: '',
        age: 0,
        weight: 0,
        gender: 'male',
        neutered: false,
        imageUrl: null,
        dbtiResult: null,
        petsitterGuide: null,
    });
    const setProfile = (newProfile) => {
        profile.value = newProfile;
    };
    const updateProfile = (updatedProfile) => {
        profile.value = updatedProfile;
    };
    const analyzeDogPersonality = async () => {
        // API 호출 로직
        profile.value.dbtiResult = {
            type: 'ENFP',
            description: '친근하고 활발한 성격의 강아지입니다.',
        };
    };
    const generatePetsitterGuide = async () => {
        // API 호출 로직
        profile.value.petsitterGuide = {
            generalInfo: `${profile.value.name}는 ${profile.value.breed} 품종으로, ${profile.value.age}세 ${profile.value.gender === 'male' ? '수컷' : '암컷'}입니다. 체중은 ${profile.value.weight}kg이며, ${profile.value.neutered ? '중성화가 되어있습니다.' : '중성화가 되어있지 않습니다.'}`,
            routineInfo: '일반적으로 아침 7시에 일어나 산책하고, 저녁 9시에 잠드는 패턴을 가지고 있습니다. 낮잠은 보통 오후 2시경에 2시간 정도 자며, 활동량이 많은 편입니다.',
            feedingInfo: '하루 2번 아침 8시, 저녁 6시에 각 1컵(200g)의 사료를 급여합니다. 습식 사료를 선호하며, 닭고기 알러지가 있으니 주의해주세요.',
            healthInfo: '정기적인 검진은 3개월마다 받고 있으며, 최근 접종한 백신은 종합백신입니다. 특별한 건강 이슈는 없으나 더운 날씨에 체력 소모가 빠른 편입니다.',
            specialNotes: [
                '낯선 사람을 무서워하니 천천히 다가가주세요',
                '배를 만져주는 것을 좋아합니다',
                '다른 강아지를 만나면 흥분하니 주의해주세요',
                '장난감 중 노란 공을 가장 좋아합니다',
            ],
            emergencyTips: [
                '구토나 설사가 지속되면 즉시 동물병원에 연락해주세요',
                '가까운 24시간 동물병원: 댕댕 동물병원 (02-123-4567)',
                '평소 복용 중인 약: 없음',
                '주치의: 김철수 수의사 (010-9876-5432)',
            ],
        };
    };
    const fetchProfile = async () => {
        // API 호출 로직
        profile.value = {
            id: 1,
            name: '멍멍이',
            breed: '골든 리트리버',
            age: 3,
            weight: 30,
            gender: 'male',
            neutered: true,
            imageUrl: '/default-profile.png',
            dbtiResult: null,
            petsitterGuide: null,
        };
    };
    return {
        profile,
        setProfile,
        updateProfile,
        analyzeDogPersonality,
        generatePetsitterGuide,
        fetchProfile,
    };
});
