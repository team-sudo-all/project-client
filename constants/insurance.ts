export const INSURANCE_TYPES = {
  NATIONAL: {
    id: 'national',
    label: {
      ko: '국민건강보험',
      en: 'National Health Insurance',
      zh: '国民健康保险',
      vi: 'Bảo hiểm y tế quốc gia',
    },
    coverageRate: 0.7, // 70% 보장
  },
  PRIVATE: {
    id: 'private',
    label: {
      ko: '민간보험',
      en: 'Private Insurance',
      zh: '私人保险',
      vi: 'Bảo hiểm tư nhân',
    },
    coverageRate: 0.5, // 50% 평균 보장
  },
  NONE: {
    id: 'none',
    label: {
      ko: '보험 없음',
      en: 'No Insurance',
      zh: '无保险',
      vi: 'Không có bảo hiểm',
    },
    coverageRate: 0,
  },
} as const;

export const DEPARTMENT_LIST = [
  { id: 'internal', ko: '내과', en: 'Internal Medicine' },
  { id: 'surgery', ko: '외과', en: 'Surgery' },
  { id: 'pediatrics', ko: '소아과', en: 'Pediatrics' },
  { id: 'ob-gyn', ko: '산부인과', en: 'Obstetrics and Gynecology' },
  { id: 'orthopedics', ko: '정형외과', en: 'Orthopedics' },
  { id: 'neurology', ko: '신경과', en: 'Neurology' },
  { id: 'psychiatry', ko: '정신건강의학과', en: 'Psychiatry' },
  { id: 'dermatology', ko: '피부과', en: 'Dermatology' },
  { id: 'ophthalmology', ko: '안과', en: 'Ophthalmology' },
  { id: 'ent', ko: '이비인후과', en: 'Ear, Nose, and Throat' },
  { id: 'urology', ko: '비뇨기과', en: 'Urology' },
  { id: 'dentistry', ko: '치과', en: 'Dentistry' },
  { id: 'emergency', ko: '응급의학과', en: 'Emergency Medicine' },
] as const;
