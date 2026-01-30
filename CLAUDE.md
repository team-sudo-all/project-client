# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Na-um (나음)** - 외국인을 위한 의료 서비스 플랫폼. 외국인들이 한국에서 의료 서비스를 이용할 때 겪는 언어 장벽, 정보 부족, 진료비 불투명성 문제를 해결하는 웹 애플리케이션.

**핵심 기능**: 회원가입, 증상 입력, AI 차트 생성, 병원 추천(네이버 지도), 병원 정보 조회, 의약품 정보

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint
```

## 기술 스택

- **Next.js 16.1.6** (App Router, React 19, Turbopack)
- **TypeScript** (strict 모드)
- **Tailwind CSS 4** + **shadcn/ui**
- **React Hook Form + Zod** (폼 관리 및 검증)
- **i18next** (다국어: 한국어, 영어, 중국어, 베트남어)
- **Zustand** (전역 상태 관리 - persist 미들웨어 사용)
- **TanStack Query** (서버 상태 관리)
- **Axios** (HTTP 클라이언트, 인터셉터 설정됨)

## 아키텍처 핵심 개념

### 1. 인증 흐름

- **JWT 토큰 기반 인증**
- 토큰은 `localStorage`와 Zustand `persist` 미들웨어를 통해 이중 저장됨
- `lib/api/client.ts`의 Axios 인터셉터가 모든 요청에 자동으로 토큰 추가
- 401 에러 시 자동 로그아웃 및 `/login` 리다이렉트

```typescript
// lib/stores/userStore.ts - persist 미들웨어로 새로고침 시에도 유지
// lib/api/client.ts - request/response 인터셉터로 토큰 자동 관리
```

### 2. 상태 관리 전략

**Zustand 스토어 (3개)**:
- `userStore` - 사용자 정보, 토큰, 인증 상태 (persist)
- `symptomStore` - 선택된 증상, 자유 텍스트 입력
- `chartStore` - 생성된 의료 차트, 로딩 상태

**TanStack Query**:
- 서버 데이터 캐싱 및 동기화
- API 호출은 `lib/api/*` 모듈에 정의된 함수 사용

### 3. API 클라이언트 구조

모든 API 호출은 `lib/api/client.ts`를 통해 이루어짐:
- `lib/api/auth.ts` - 인증 (회원가입, 로그인, 로그아웃)
- `lib/api/chart.ts` - AI 차트 생성, 번역, 수정
- `lib/api/hospitals.ts` - 병원 검색, 진료과 추천, 진료비 예측
- `lib/api/medicine.ts` - 의약품 검색, 알러지 체크, 유사 의약품

**중요**: API 기본 URL은 `.env.local`의 `NEXT_PUBLIC_API_URL` (기본값: http://localhost:8000)

### 4. 다국어 구조

- `lib/i18n/config.ts` - i18next 설정, 브라우저 언어 감지
- `public/locales/{ko,en,zh,vi}/common.json` - 번역 파일
- `constants/languages.ts` - 지원 언어 목록
- **증상, 병원, 의약품 데이터도 다국어 지원** (`label: { ko, en, zh, vi }` 구조)

### 5. 타입 정의 계층

`types/` 디렉토리의 타입들은 프로젝트 전체에서 사용:
- `user.ts` - 사용자, 인증, 보험 정보
- `symptom.ts` - 증상 카테고리, 세부 증상 (다국어 레이블)
- `hospital.ts` - 병원, 검색, 진료비 예측
- `medicine.ts` - 의약품, 알러지 경고
- `chart.ts` - 의료 차트, AI 생성 요청

### 6. 증상 데이터 구조

`constants/symptoms.ts`의 `SYMPTOM_CATEGORIES`:
- **2단계 계층**: 1차 카테고리 (두통, 복통, 발열 등) → 2차 세부 증상
- 각 증상은 `severity` (mild/moderate/severe) 포함
- 모든 레이블이 4개 언어 지원

**사용 패턴**:
```typescript
// 1. 사용자가 1차 카테고리 선택
// 2. 해당 카테고리의 subSymptoms 표시
// 3. 선택된 증상은 symptomStore에 저장
// 4. AI 차트 생성 시 증상 데이터 전송
```

### 7. 라우팅 구조

Next.js App Router의 Route Groups 사용:
- `app/(auth)/` - 로그인, 회원가입 (인증 전)
- `app/(main)/` - 대시보드, 증상, 차트, 병원, 의약품 (인증 후)

**레이아웃 분리**: 인증 전/후 다른 레이아웃 적용 가능

### 8. 환경 변수

`.env.local` 필수 설정:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id
OPENAI_API_KEY=your_api_key
```

## 개발 시 주의사항

### 불변성 패턴

```typescript
// ❌ 뮤테이션 금지
function updateUser(user, name) {
  user.name = name;
  return user;
}

// ✅ 불변성 유지
function updateUser(user, name) {
  return { ...user, name };
}
```

### Zustand 스토어 사용

```typescript
// ✅ 컴포넌트에서
const { user, setUser } = useUserStore();
const { selectedSymptoms, toggleSymptom } = useSymptomStore();

// ✅ 스토어 외부에서 (예: API 콜백)
useUserStore.getState().setUser(userData);
```

### API 호출 패턴

```typescript
// ✅ TanStack Query와 함께 사용
import { authAPI } from '@/lib/api/auth';
import { useMutation } from '@tanstack/react-query';

const { mutate } = useMutation({
  mutationFn: authAPI.login,
  onSuccess: (data) => {
    useUserStore.getState().setUser(data.user);
    useUserStore.getState().setToken(data.token);
  },
});
```

### 다국어 사용

```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
const text = t('symptoms.title'); // "증상 입력"
i18n.changeLanguage('en'); // 언어 변경
```

## 코드 스타일

- 함수: 50줄 이하
- 파일: 800줄 이하
- 불변성 패턴 필수
- TypeScript strict 모드

## 커밋 메시지

```
[타입] 제목

본문 (선택)

Co-Authored-By: Claude <noreply@anthropic.com>
```

타입: feat, fix, docs, style, refactor, test, chore
