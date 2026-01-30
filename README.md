# Na-um (나음)

> **외국인을 위한 종합 의료 서비스 플랫폼**
> 
> *So you don't stop, even in unfamiliar pain*

## 🚀 프로젝트 개요

한국에 거주하는 외국인들이 의료 서비스를 이용할 때 겪는 **언어 장벽**, **정보 부족**, **진료비 불투명성** 등의 문제를 해결하기 위한 웹 애플리케이션입니다.

## ✨ 주요 기능

### 1. 🔐 회원가입 및 인증
- 외국인 사용자 맞춤 4단계 회원가입
- 보험 정보 (국민건강보험, 글로벌 보험 선택)
- 알러지 정보, 복약 정보, 기저질환 관리
- "없음" 원클릭 버튼으로 편리한 입력

### 2. 🩺 증상 입력 및 AI 차트 생성
- 카테고리별 증상 선택 UI
- 다국어 자유 텍스트 입력 지원
- AI 기반 의료 차트 자동 생성
- 차트 이미지 저장 기능

### 3. 🏥 병원 추천
- 카카오맵 기반 주변 병원 검색
- 증상 기반 진료과 자동 추천
- 예상 진료비 표시
- 응급도 판단 (Emergency/High/Moderate/Low)
- 전화/길찾기 바로가기

### 4. 📖 병원 방문 가이드
- 한국 의료 시스템 안내 (1차/2차/3차 의료기관)
- 방문 전 준비물 체크리스트
- 병원 방문 7단계 절차 안내
- 진료비 구조 및 보험 안내
- 유용한 팁 모음

### 5. 💊 의약품 검색
- 의약품명/증상으로 검색
- 일반의약품(OTC)/전문의약품(RX) 구분
- 알러지 위험 성분 확인
- 예상 가격 안내
- 동일 주성분 대체 의약품 추천

### 6. 🌍 다국어 지원
- 🇰🇷 한국어
- 🇺🇸 영어
- 실시간 언어 전환

## 🛠️ 기술 스택

### Frontend
| 기술 | 용도 |
|------|------|
| **Next.js 14+** | React 프레임워크 (App Router) |
| **TypeScript** | 타입 안전성 |
| **Tailwind CSS** | 스타일링 |
| **shadcn/ui** | UI 컴포넌트 |
| **i18next** | 다국어 지원 |
| **Zustand** | 상태 관리 |
| **Axios** | HTTP 클라이언트 |
| **Kakao Maps SDK** | 지도 표시 |

## 📁 프로젝트 구조

```
foreign-medical-service/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 인증 관련 페이지
│   │   ├── login/
│   │   └── register/        # step1~4
│   └── (main)/              # 메인 페이지
│       ├── dashboard/       # 메인 대시보드
│       ├── symptoms/        # 증상 입력
│       │   ├── detail/      # 상세 입력
│       │   └── chart/       # AI 차트
│       ├── hospitals/       # 병원 추천 (지도)
│       ├── guide/           # 병원 방문 가이드
│       └── medicine/        # 의약품 검색
│           └── result/      # 검색 결과
├── components/              # 재사용 컴포넌트
│   └── ui/                 # shadcn/ui 컴포넌트
├── lib/                    # 유틸리티
│   ├── api/               # API 클라이언트
│   ├── stores/            # Zustand 스토어
│   └── types/             # TypeScript 타입
├── constants/             # 상수 (증상 카테고리 등)
└── public/
    └── locales/          # 다국어 JSON (ko, en)
```

## 🚀 시작하기

### 필수 조건
- Node.js 18+
- npm 또는 yarn
- 백엔드 서버 (별도 레포지토리)

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/team-sudo-all/project-client.git
cd project-client

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 실제 값을 입력합니다:

```env
# API 서버 (백엔드)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# 카카오맵 API (병원 추천 지도용)
# https://developers.kakao.com/ 에서 발급
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

### 실행

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 📸 스크린샷

| 대시보드 | 증상 입력 | AI 차트 |
|---------|---------|---------|
| 메인 화면 | 카테고리 선택 | 의료 차트 생성 |

| 병원 추천 | 병원 가이드 | 의약품 검색 |
|----------|-----------|-----------|
| 카카오맵 | 방문 안내 | 약품 정보 |

## 🔒 보안

- ✅ 환경 변수로 API 키 관리 (.env.local)
- ✅ .gitignore로 민감 정보 제외
- ✅ JWT 기반 인증
- ✅ HTTPS 통신 권장

## 👥 팀 정보

**Team Sudo All**

## 📄 라이센스

MIT License

---

**개발 기간**: 2026년 1월
