export interface MedicalChart {
  id: string;
  userId: string;
  mainSymptoms: string;
  duration: string;
  painLocation: string;
  painIntensity: number; // 1-10
  accompaniedSymptoms: string[];
  medicalHistory: string[];
  currentMedications: string[];
  generatedAt: Date;
  language: string;
  translations?: {
    [key: string]: MedicalChart;
  };
}

export interface ChartGenerationRequest {
  symptoms: string[];
  freeText: string;
  language: string;
  userId: string;
}

export interface ChartExportOptions {
  format: 'image' | 'pdf';
  includeTranslation: boolean;
  languages: string[];
}
