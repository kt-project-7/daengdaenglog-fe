import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
export const useDangMoneyStore = defineStore('dangMoney', () => {
    // 요약 데이터
    const totalExpense = ref(2850000);
    const claimCount = ref(12);
    const refundRate = ref(65);
    // 차트 관련 상태
    const chartPeriod = ref('month');
    // 월별 지출 데이터
    const monthlyExpenseData = ref([
        { month: '1월', amount: 150000 },
        { month: '2월', amount: 220000 },
        { month: '3월', amount: 180000 },
        { month: '4월', amount: 320000 },
        { month: '5월', amount: 250000 },
        { month: '6월', amount: 190000 },
        { month: '7월', amount: 280000 },
        { month: '8월', amount: 350000 },
        { month: '9월', amount: 310000 },
        { month: '10월', amount: 230000 },
        { month: '11월', amount: 270000 },
        { month: '12월', amount: 100000 },
    ]);
    // 카테고리별 지출 데이터
    const expenseCategories = ref([
        { name: '정기검진', amount: 850000 },
        { name: '예방접종', amount: 450000 },
        { name: '질병치료', amount: 950000 },
        { name: '수술', amount: 350000 },
        { name: '약품', amount: 250000 },
    ]);
    // 카테고리 색상
    const categoryColors = [
        '#f59e0b', // 주 색상
        '#fbbf24',
        '#fcd34d',
        '#fde68a',
        '#fef3c7',
    ];
    // 청구 내역 관련 상태
    const statusFilter = ref('all');
    const dateFilter = ref('all');
    const currentPage = ref(1);
    const itemsPerPage = 5;
    const showClaimDetailModal = ref(false);
    const selectedClaim = ref(null);
    // 청구 내역 데이터
    const claimData = ref([
        {
            id: 1,
            date: '2025-03-15',
            hospital: '댕댕 동물병원',
            description: '정기검진 및 예방접종',
            medicalFee: 150000,
            claimAmount: 120000,
            refundAmount: 80000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
            notes: '정기검진 결과 모두 건강합니다.',
        },
        {
            id: 2,
            date: '2025-02-28',
            hospital: '멍멍 동물메디컬센터',
            description: '피부질환 치료',
            medicalFee: 220000,
            claimAmount: 180000,
            refundAmount: 120000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
                { name: '처방전.pdf', url: '#' },
            ],
        },
        {
            id: 3,
            date: '2025-02-10',
            hospital: '행복한 동물병원',
            description: '치과 치료',
            medicalFee: 350000,
            claimAmount: 300000,
            refundAmount: 180000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
        },
        {
            id: 4,
            date: '2025-01-25',
            hospital: '댕댕 동물병원',
            description: '혈액검사',
            medicalFee: 80000,
            claimAmount: 70000,
            refundAmount: 45000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
                { name: '검사결과지.pdf', url: '#' },
            ],
        },
        {
            id: 5,
            date: '2025-01-05',
            hospital: '24시 동물응급센터',
            description: '구토 및 설사 응급치료',
            medicalFee: 180000,
            claimAmount: 150000,
            refundAmount: 90000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
            notes: '밤에 갑자기 구토와 설사 증상이 있어 응급실 방문',
        },
        {
            id: 6,
            date: '2024-12-20',
            hospital: '멍멍 동물메디컬센터',
            description: '슬개골 탈구 수술',
            medicalFee: 1200000,
            claimAmount: 1000000,
            refundAmount: 650000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
                { name: '수술동의서.pdf', url: '#' },
            ],
        },
        {
            id: 7,
            date: '2024-11-15',
            hospital: '댕댕 동물병원',
            description: '정기검진',
            medicalFee: 100000,
            claimAmount: 80000,
            refundAmount: 50000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
        },
        {
            id: 8,
            date: '2024-10-30',
            hospital: '행복한 동물병원',
            description: '알러지 검사',
            medicalFee: 150000,
            claimAmount: 120000,
            refundAmount: 75000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
                { name: '검사결과지.pdf', url: '#' },
            ],
        },
        {
            id: 9,
            date: '2024-10-05',
            hospital: '멍멍 동물메디컬센터',
            description: '예방접종',
            medicalFee: 120000,
            claimAmount: 100000,
            refundAmount: 60000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
        },
        {
            id: 10,
            date: '2024-09-20',
            hospital: '댕댕 동물병원',
            description: '귀 염증 치료',
            medicalFee: 90000,
            claimAmount: 75000,
            refundAmount: 45000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
        },
        {
            id: 11,
            date: '2024-09-05',
            hospital: '24시 동물응급센터',
            description: '이물질 제거 (장난감 삼킴)',
            medicalFee: 250000,
            claimAmount: 200000,
            refundAmount: 120000,
            status: 'approved',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
                { name: 'X-ray 사진.pdf', url: '#' },
            ],
            notes: '장난감 조각을 삼켜서 응급 처치 필요',
        },
        {
            id: 12,
            date: '2025-03-20',
            hospital: '멍멍 동물메디컬센터',
            description: '건강검진 패키지',
            medicalFee: 300000,
            claimAmount: 250000,
            refundAmount: 0,
            status: 'pending',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
        },
        {
            id: 13,
            date: '2024-08-15',
            hospital: '행복한 동물병원',
            description: '피부 알러지 치료',
            medicalFee: 180000,
            claimAmount: 150000,
            refundAmount: 0,
            status: 'rejected',
            documents: [
                { name: '진료확인서.pdf', url: '#' },
                { name: '영수증.pdf', url: '#' },
            ],
            notes: '보험 적용 대상이 아닌 치료로 판단되어 거절됨',
        },
    ]);
    // 필터링된 청구 내역
    const filteredClaims = computed(() => {
        let filtered = [...claimData.value];
        // 상태 필터링
        if (statusFilter.value !== 'all') {
            filtered = filtered.filter((claim) => claim.status === statusFilter.value);
        }
        // 날짜 필터링
        if (dateFilter.value !== 'all') {
            const now = new Date();
            let cutoffDate = new Date();
            switch (dateFilter.value) {
                case '1month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case '3months':
                    cutoffDate.setMonth(now.getMonth() - 3);
                    break;
                case '6months':
                    cutoffDate.setMonth(now.getMonth() - 6);
                    break;
                case '1year':
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            filtered = filtered.filter((claim) => new Date(claim.date) >= cutoffDate);
        }
        // 정렬 (최신순)
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return filtered;
    });
    // 페이지네이션
    const totalPages = computed(() => {
        return Math.ceil(filteredClaims.value.length / itemsPerPage);
    });
    const paginatedClaims = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredClaims.value.slice(start, end);
    });
    // 유틸리티 함수
    function formatCurrency(amount) {
        return amount.toLocaleString('ko-KR') + '원';
    }
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    }
    function getStatusText(status) {
        switch (status) {
            case 'pending':
                return '처리중';
            case 'approved':
                return '승인';
            case 'rejected':
                return '거절';
            default:
                return '';
        }
    }
    function getStatusClass(status) {
        switch (status) {
            case 'pending':
                return 'bg-dang-pending text-dang-pending-text';
            case 'approved':
                return 'bg-dang-approved text-dang-approved-text';
            case 'rejected':
                return 'bg-dang-rejected text-dang-rejected-text';
            default:
                return '';
        }
    }
    function calculateRefundRate(claim) {
        if (claim.claimAmount === 0)
            return 0;
        return Math.round((claim.refundAmount / claim.claimAmount) * 100);
    }
    // 청구 내역 함수
    function prevPage() {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    }
    function nextPage() {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    }
    function resetFilters() {
        statusFilter.value = 'all';
        dateFilter.value = 'all';
        currentPage.value = 1;
    }
    function viewClaimDetail(claim) {
        selectedClaim.value = claim;
        showClaimDetailModal.value = true;
    }
    function closeClaimDetailModal() {
        showClaimDetailModal.value = false;
        selectedClaim.value = null;
    }
    // 차트 기간 변경
    function changeChartPeriod(period) {
        chartPeriod.value = period;
    }
    return {
        totalExpense,
        claimCount,
        refundRate,
        chartPeriod,
        monthlyExpenseData,
        expenseCategories,
        categoryColors,
        statusFilter,
        dateFilter,
        currentPage,
        itemsPerPage,
        showClaimDetailModal,
        selectedClaim,
        claimData,
        filteredClaims,
        totalPages,
        paginatedClaims,
        formatCurrency,
        formatDate,
        getStatusText,
        getStatusClass,
        calculateRefundRate,
        prevPage,
        nextPage,
        resetFilters,
        viewClaimDetail,
        closeClaimDetailModal,
        changeChartPeriod,
    };
});
