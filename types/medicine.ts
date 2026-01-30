export interface Medicine {
  id: string;
  name: string;
  nameEn?: string;
  requiresPrescription: boolean;
  mainIngredients: string[];
  effects: string;
  warningIngredients: string[];
  allergyIngredients: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  manufacturer?: string;
  imageUrl?: string;
}

export interface MedicineSearchResult {
  medicines: Medicine[];
  total: number;
  page: number;
  limit: number;
}

export interface AllergyWarning {
  medicineId: string;
  medicineName: string;
  allergyIngredients: string[];
  userAllergies: string[];
  matchedAllergies: string[];
  severity: 'high' | 'medium' | 'low';
}
