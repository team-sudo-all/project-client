export interface Hospital {
  id: string;
  name: string;
  nameEn?: string;
  type: HospitalType;
  departments: string[];
  address: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  operatingHours: OperatingHours;
  hasForeignLanguageSupport: boolean;
  supportedLanguages: string[];
  hasParking: boolean;
}

export type HospitalType =
  | '상급종합병원'
  | '종합병원'
  | '병원'
  | '의원'
  | '요양병원';

export interface OperatingHours {
  weekday: string;
  saturday?: string;
  sunday?: string;
  holiday?: string;
}

export interface SearchParams {
  lat: number;
  lng: number;
  radius: number; // km
  department?: string;
  query?: string;
}

export interface CostEstimate {
  min: number;
  max: number;
  currency: string;
  disclaimer: string;
}
