import { create } from 'zustand';

// 백엔드 API 응답에 맞춘 타입
interface ChartData {
  chart: string; // AI가 생성한 차트 텍스트
}

interface ChartStore {
  chartText: string | null;
  isGenerating: boolean;
  error: string | null;
  setChartText: (text: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  updateChartText: (text: string) => void;
  clearChart: () => void;
}

export const useChartStore = create<ChartStore>((set) => ({
  chartText: null,
  isGenerating: false,
  error: null,

  setChartText: (text) => {
    set({ chartText: text, isGenerating: false, error: null });
  },

  setIsGenerating: (isGenerating) => {
    set({ isGenerating, error: null });
  },

  setError: (error) => {
    set({ error, isGenerating: false });
  },

  updateChartText: (text) => {
    set({ chartText: text });
  },

  clearChart: () => {
    set({ chartText: null, isGenerating: false, error: null });
  },
}));
