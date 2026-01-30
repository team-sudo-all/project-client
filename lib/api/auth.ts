import apiClient from './client';
import { LoginData, LoginResponse, RegisterData, RegisterResponse, User } from '@/lib/types/user';

export const authAPI = {
  // 회원가입
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    console.log('🚀 [회원가입 요청] 데이터:', data);
    const response = await apiClient.post('/api/signup', data);
    console.log('✨ [회원가입 성공]', response.data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginData): Promise<LoginResponse> => {
    console.log('🚀 [로그인 요청] 아이디:', data.user_id);
    const response = await apiClient.post('/api/login', data);
    console.log('✨ [로그인 성공]', response.data);
    return response.data;
  },

  // 전체 사용자 조회 (테스트용)
  getUsers: async (): Promise<Record<string, User>> => {
    console.log('🚀 [사용자 목록 조회 요청]');
    const response = await apiClient.get('/api/users');
    console.log('✨ [사용자 목록 조회 성공] 사용자 수:', Object.keys(response.data).length);
    return response.data;
  },
};
