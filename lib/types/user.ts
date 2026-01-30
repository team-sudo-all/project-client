// API 요청/응답 타입 정의

// 회원가입 요청 데이터
export interface RegisterData {
  name: string;
  birth_date: string;
  phone_number: string;
  insurance_info: string;
  allergies: string;
  medications: string;
  medical_history: string;
  user_id: string;
  password: string;
  address?: string;
  email?: string;
}

// 로그인 요청 데이터
export interface LoginData {
  user_id: string;
  password: string;
}

// 회원가입 응답
export interface RegisterResponse {
  message: string;
  user_name: string;
}

// 로그인 응답
export interface LoginResponse {
  message: string;
  user_id: string;
  user_name: string;
}

// 사용자 정보 (프론트엔드 상태 관리용)
export interface User {
  user_id: string;
  name: string;
  birth_date: string;
  phone_number: string;
  email?: string;
  address?: string;
  insurance_info: string;
  allergies: string;
  medications: string;
  medical_history: string;
}

// Step별 회원가입 데이터 (localStorage용)
export interface RegisterFormData {
  username?: string;
  password?: string;
  fullName?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  location?: string;
  insurance?: {
    hasNationalInsurance: boolean;
    globalInsurance?: string;
    otherInsurance: string;
  };
  allergies?: string[];
  medications?: string[];
  chronicDiseases?: string[];
}
