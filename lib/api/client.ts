import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초로 증가 (AI 응답 대기 시간)
});

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 성공/에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 로그
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;
    const status = response.status;

    console.log(`✅ [API ${method}] ${url} - Status: ${status}`);
    console.log('📦 Response Data:', response.data);

    return response;
  },
  (error) => {
    // 에러 로그
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const status = error.response?.status;
    const errorData = error.response?.data;

    console.error(`❌ [API ${method}] ${url} - Status: ${status}`);
    console.error('📦 Error Data:', errorData);

    if (error.response?.status === 401) {
      // 인증 오류 시 로그아웃 처리
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
