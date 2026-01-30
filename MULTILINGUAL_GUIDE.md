# 다국어 적용 가이드 (Multilingual Implementation Guide)

## 완료된 페이지
- ✅ 홈화면 (/)
- ✅ 로그인 (/login)
- ⏳ 회원가입 Step 1-4 (아래 패턴 참고)

## 적용 방법

### 1. 기본 구조

```typescript
'use client';

import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function YourPage() {
  const { t } = useTranslation();

  return (
    <div>
      <LanguageSwitcher />  {/* 언어 전환 버튼 */}

      <h1>{t('your.translation.key')}</h1>
      {/* 나머지 컴포넌트 */}
    </div>
  );
}
```

### 2. 회원가입 Step 1 적용 예시

#### Before (한글 하드코딩)
```typescript
<CardTitle className="text-2xl">회원가입</CardTitle>
<CardDescription>1단계: 아이디 설정</CardDescription>
```

#### After (다국어 적용)
```typescript
<CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
<CardDescription>{t('register.step1Title')}</CardDescription>
```

### 3. 회원가입 Step 2-4 적용 패턴

각 Step 페이지마다:

1. **import 추가**
```typescript
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
```

2. **컴포넌트 내부에 추가**
```typescript
const { t } = useTranslation();
```

3. **JSX 최상단에 버튼 추가**
```typescript
<div className="flex min-h-screen...">
  <LanguageSwitcher />
  {/* 나머지 컴포넌트 */}
</div>
```

4. **하드코딩된 텍스트를 t() 함수로 변경**

| Step | 주요 변경 사항 |
|------|---------------|
| **Step 1** | - 제목: `t('register.step1Title')` <br> - 중복 확인: `t('register.checkDuplicate')` <br> - 플레이스홀더: `t('register.usernamePlaceholder')` |
| **Step 2** | - 제목: `t('register.step2Title')` <br> - 비밀번호: `t('auth.password')` <br> - 비밀번호 확인: `t('auth.passwordConfirm')` <br> - 요구사항: `t('register.passwordLength')` 등 |
| **Step 3** | - 제목: `t('register.step3Title')` <br> - 이름: `t('auth.fullName')` <br> - 생년월일: `t('auth.birthDate')` <br> - 전화번호: `t('auth.phone')` |
| **Step 4** | - 제목: `t('register.step4Title')` <br> - 보험: `t('register.insurance')` <br> - 알러지: `t('register.allergies')` <br> - 복약: `t('register.medications')` |

### 4. 공통 버튼 텍스트

```typescript
// 이전
<Button>이전</Button>

// 적용 후
<Button>{t('common.back')}</Button>
```

```typescript
// 다음 단계
<Button>다음 단계</Button>

// 적용 후
<Button>{t('common.next')}</Button>
```

### 5. Alert 메시지

```typescript
// Before
<AlertDescription>사용 가능한 아이디입니다.</AlertDescription>

// After
<AlertDescription>{t('register.usernameAvailable')}</AlertDescription>
```

## 번역 키 목록

### common
- `common.back` - "이전" / "Back"
- `common.next` - "다음 단계" / "Next Step"
- `common.cancel` - "취소" / "Cancel"
- `common.confirm` - "확인" / "Confirm"
- `common.required` - "필수" / "Required"
- `common.optional` - "선택" / "Optional"

### auth
- `auth.login` - "로그인" / "Login"
- `auth.register` - "회원가입" / "Sign Up"
- `auth.username` - "아이디" / "Username"
- `auth.password` - "비밀번호" / "Password"
- `auth.passwordConfirm` - "비밀번호 확인" / "Confirm Password"
- `auth.fullName` - "이름 (풀네임)" / "Full Name"
- `auth.birthDate` - "생년월일" / "Date of Birth"
- `auth.phone` - "전화번호" / "Phone Number"
- `auth.email` - "이메일" / "Email"
- `auth.location` - "거주 지역" / "Location"

### register
- `register.step1Title` - "1단계: 아이디 설정" / "Step 1: Set Username"
- `register.step2Title` - "2단계: 비밀번호 설정" / "Step 2: Set Password"
- `register.step3Title` - "3단계: 개인정보 입력" / "Step 3: Personal Information"
- `register.step4Title` - "4단계: 의료정보 입력" / "Step 4: Medical Information"
- `register.progress` - "{{current}}/4"
- `register.checkDuplicate` - "중복 확인" / "Check Availability"
- `register.checking` - "확인 중..." / "Checking..."
- `register.usernameAvailable` - "사용 가능한 아이디입니다." / "This username is available."
- `register.usernameUnavailable` - "이미 사용 중이거나 사용할 수 없는 아이디입니다." / "This username is already taken or unavailable."
- `register.passwordMatch` - "비밀번호가 일치합니다." / "Passwords match."
- `register.passwordMismatch` - "비밀번호가 일치하지 않습니다." / "Passwords do not match."
- `register.completeRegistration` - "회원가입 완료" / "Complete Registration"

## 테스트 방법

1. 브라우저에서 페이지 열기
2. 우측 상단 언어 전환 버튼 클릭
3. 모든 텍스트가 영어/한글로 전환되는지 확인

## 주의사항

- ✅ 모든 페이지를 'use client'로 설정해야 함
- ✅ LanguageSwitcher는 각 페이지 최상단에 추가
- ✅ 플레이스홀더, 버튼 텍스트, Alert 메시지 모두 t() 함수로 변경
- ✅ 개행문자(\n)가 포함된 텍스트도 번역 파일에서 처리 가능
