# 댕댕로그 (DaengDaengLog)

반려견을 위한 종합 관리 플랫폼으로, 반려견의 일상을 기록하고 관리할 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **프론트엔드**: Vue 3, TypeScript, Tailwind CSS
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **UI 라이브러리**: Lucide Vue (아이콘)
- **차트**: Chart.js
- **PDF 생성**: html2pdf.js
- **마크다운 변환**: markdown-it
- **API 통신**: Axios
- **빌드 도구**: Vite

## 주요 기능

### 반려견 프로필 관리

- 반려견의 기본 정보(이름, 품종, 나이, 성별, 체중, 중성화 여부 등) 관리
- 프로필 이미지 업로드 및 관리
- 여러 반려견 프로필 전환 기능

### 일기 작성 및 관리

- 일상 기록 작성 및 조회
- 일기 목록 보기
- 상세 일기 조회

### 댕가이드

- 펫시터를 위한 가이드 생성 및 관리
- 가이드 목록 보기
- 마크다운 형식 지원 (제목, 강조, 목록, 인용구 등)
- 가이드 내용의 마크다운 렌더링

### 댕머니 차트

- 반려견 관련 지출 추적 및 시각화

### 인증 및 권한 관리

- 로그인/로그아웃 기능
- 보호된 라우트에 대한 접근 제어

## 프로젝트 구조

```
src/
├── apis/         # API 통신 관련 코드
├── assets/       # 정적 자산 (이미지, 폰트 등)
├── components/   # 재사용 가능한 컴포넌트
│   ├── dang-money/  # 댕머니 관련 컴포넌트
│   ├── diary/       # 일기 관련 컴포넌트
│   ├── guide/       # 가이드 관련 컴포넌트
│   ├── landing/     # 랜딩 페이지 관련 컴포넌트
│   ├── modals/      # 모달 컴포넌트
│   └── profile/     # 프로필 관련 컴포넌트
├── data/         # 정적 데이터
├── router/       # 라우팅 설정
├── stores/       # Pinia 상태 관리 스토어
├── types/        # TypeScript 타입 정의
├── utils/        # 유틸리티 함수
└── views/        # 페이지 컴포넌트
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
