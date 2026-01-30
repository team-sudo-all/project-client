import { create } from 'zustand';
import { Symptom } from '@/types/symptom';

interface SymptomStore {
  selectedSymptoms: Symptom[];
  freeText: string;
  addSymptom: (symptom: Symptom) => void;
  removeSymptom: (symptomId: string) => void;
  toggleSymptom: (symptom: Symptom) => void;
  setFreeText: (text: string) => void;
  clear: () => void;
  hasSymptoms: () => boolean;
}

export const useSymptomStore = create<SymptomStore>((set, get) => ({
  selectedSymptoms: [],
  freeText: '',

  addSymptom: (symptom) => {
    set((state) => ({
      selectedSymptoms: [...state.selectedSymptoms, symptom],
    }));
  },

  removeSymptom: (symptomId) => {
    set((state) => ({
      selectedSymptoms: state.selectedSymptoms.filter((s) => s.id !== symptomId),
    }));
  },

  toggleSymptom: (symptom) => {
    const state = get();
    const exists = state.selectedSymptoms.some((s) => s.id === symptom.id);

    if (exists) {
      state.removeSymptom(symptom.id);
    } else {
      state.addSymptom(symptom);
    }
  },

  setFreeText: (text) => {
    set({ freeText: text });
  },

  clear: () => {
    set({ selectedSymptoms: [], freeText: '' });
  },

  hasSymptoms: () => {
    const state = get();
    return state.selectedSymptoms.length > 0 || state.freeText.trim().length > 0;
  },
}));
