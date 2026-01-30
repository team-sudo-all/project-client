export interface User {
  id: string;
  username: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email?: string;
  location?: string;
  insurance: Insurance;
  allergies: string[];
  medications: string[];
  chronicDiseases: string[];
  createdAt: Date;
}

export interface Insurance {
  hasNationalInsurance: boolean;
  otherInsurance?: string;
}

export interface RegisterData {
  fullName: string;
  birthDate: Date;
  phone: string;
  username: string;
  password: string;
  insurance: Insurance;
  allergies: string[];
  medications: string[];
  chronicDiseases: string[];
  location?: string;
  email?: string;
}

export interface LoginData {
  username: string;
  password: string;
}
