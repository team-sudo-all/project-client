import apiClient from './client';

// 병원 추천 요청
interface RecommendHospitalsRequest {
  user_id: string;
  symptoms: string;
  latitude: number;
  longitude: number;
  radius?: number;
}

// 병원 정보
export interface Hospital {
  name: string;
  department: string;
  distance: string;
  address: string;
  phone: string;
  url: string;
  x: number; // 경도
  y: number; // 위도
}

// 병원 추천 응답
export interface RecommendHospitalsResponse {
  recommended_department: string;
  urgency_level: 'Emergency' | 'High' | 'Moderate' | 'Low';
  reason_kr: string;  // 한국어 추천 이유
  reason_en: string;  // 영어 추천 이유
  hospitals: Hospital[];
}

export const hospitalAPI = {
  // 병원 추천 (POST /api/recommend-hospitals)
  recommendHospitals: async (request: RecommendHospitalsRequest): Promise<RecommendHospitalsResponse> => {
    const response = await apiClient.post('/api/recommend-hospitals', {
      user_id: request.user_id,
      symptoms: request.symptoms,
      latitude: request.latitude,
      longitude: request.longitude,
      radius: request.radius || 2000,
    });
    return response.data;
  },
};
