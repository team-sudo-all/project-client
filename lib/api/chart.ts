import apiClient from './client';

// 백엔드 API 요청/응답 타입

// 차트 생성 요청 (저장 X)
interface GenerateChartRequest {
  user_id: string;
  selected_symptoms: string[];
  detail_description: string;
}

interface GenerateChartResponse {
  chart: string;
}

// 차트 저장 요청
interface SaveChartRequest {
  user_id: string;
  symptoms: string[];
  detail: string;
  final_chart_text: string;
}

interface SaveChartResponse {
  message: string;
  history_count: number;
}

// 히스토리 조회
interface HistoryItem {
  date: string;
  symptoms: string[];
  detail: string;
  result_text: string;
}

interface HistoryResponse {
  history: HistoryItem[];
}

// 예상 진료비 안내
interface EstimateCostResponse {
  cost_guide: string;
}

export const chartAPI = {
  // AI 차트 생성 (POST /api/generate-chart) - 저장하지 않음
  generateChart: async (request: GenerateChartRequest): Promise<GenerateChartResponse> => {
    const response = await apiClient.post('/api/generate-chart', request);
    return response.data;
  },

  // 차트 저장 (POST /api/save-chart) - 사용자가 수정한 최종 차트 저장
  saveChart: async (request: SaveChartRequest): Promise<SaveChartResponse> => {
    const response = await apiClient.post('/api/save-chart', request);
    return response.data;
  },

  // 사용자 히스토리 조회 (GET /api/history/{user_id})
  getHistory: async (userId: string): Promise<HistoryResponse> => {
    const response = await apiClient.get(`/api/history/${userId}`);
    return response.data;
  },

  // 예상 진료비 안내 (POST /api/estimate-cost)
  // API는 query parameter로 user_id 전송
  estimateCost: async (userId: string): Promise<EstimateCostResponse> => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${baseURL}/api/estimate-cost?user_id=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
};
