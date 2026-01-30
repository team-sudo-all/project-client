export interface Symptom {
  id: string;
  categoryId: string;
  label: {
    ko: string;
    en: string;
    zh?: string;
    vi?: string;
  };
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface SymptomCategory {
  id: string;
  icon: string;
  label: {
    ko: string;
    en: string;
    zh?: string;
    vi?: string;
  };
  subSymptoms: Symptom[];
}

export interface SymptomInput {
  selectedSymptoms: Symptom[];
  freeText: string;
  language: string;
}
