import apiClient from './client';
import { Hospital, SearchParams, CostEstimate } from '@/types/hospital';

export const hospitalAPI = {
  // 병원 검색 (위치 기반)
  search: async (params: SearchParams): Promise<Hospital[]> => {
    const response = await apiClient.get('/hospitals/search', { params });
    return response.data;
  },

  // 병원 상세 정보 조회
  getById: async (hospitalId: string): Promise<Hospital> => {
    const response = await apiClient.get(`/hospitals/${hospitalId}`);
    return response.data;
  },

  // 병원명으로 검색
  searchByName: async (query: string): Promise<Hospital[]> => {
    const response = await apiClient.get('/hospitals/search-by-name', {
      params: { query },
    });
    return response.data;
  },

  // 진료비 예측
  estimateCost: async (
    hospitalId: string,
    symptoms: string[],
    insuranceType: string
  ): Promise<CostEstimate> => {
    const response = await apiClient.post(`/hospitals/${hospitalId}/estimate-cost`, {
      symptoms,
      insuranceType,
    });
    return response.data;
  },

  // 추천 진료과 조회
  getRecommendedDepartment: async (symptoms: string[]): Promise<{ department: string; urgency: string }> => {
    const response = await apiClient.post('/hospitals/recommend-department', {
      symptoms,
    });
    return response.data;
  },
};
