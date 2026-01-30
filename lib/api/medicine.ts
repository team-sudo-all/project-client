import apiClient from './client';

// 의약품 검색 요청
export interface SearchMedicineRequest {
  user_id: string;
  keyword: string;
}

// 의약품 검색 응답
export interface SearchMedicineResponse {
  medicine_info_kr: string;  // 한국어 약품 정보
  medicine_info_en: string;  // 영어 약품 정보
  image_url?: string;        // 약품 이미지 URL (선택)
}

// 파싱된 의약품 정보
export interface ParsedMedicineInfo {
  name: {
    korean: string;
    english: string;
  };
  classification: 'OTC' | 'RX' | 'Unknown';
  classificationDesc: string;
  primaryUse: string;
  safetyStatus: 'SAFE' | 'CAUTION' | 'WARNING' | 'Unknown';
  allergyInfo: string;
  priceRange: string;
  usageTip: string;
  alternatives: string[];  // 동일 주성분 약품 목록 추가
  rawText: string;
}

// API 응답 텍스트 파싱 함수
export function parseMedicineInfo(infoText: string): ParsedMedicineInfo {
  const result: ParsedMedicineInfo = {
    name: { korean: '', english: '' },
    classification: 'Unknown',
    classificationDesc: '',
    primaryUse: '',
    safetyStatus: 'Unknown',
    allergyInfo: '',
    priceRange: '',
    usageTip: '',
    alternatives: [],  // 동일 주성분 약품 목록
    rawText: infoText,
  };

  try {
    // 1. 약품명 파싱 - "약품명 (한글/영문):" 또는 "Name (KR/EN):"
    //    예: "- 타이레놀 / Tylenol"
    const nameMatch = infoText.match(/(?:약품명|Name)\s*\((?:한글\/영문|KR\/EN)\)\s*:?\s*[-–\n\s]*([^/\n]+)\s*\/\s*([^\n]+)/i);
    if (nameMatch) {
      result.name.korean = nameMatch[1].trim();
      result.name.english = nameMatch[2].trim();
    }

    // 2. 분류 파싱 - "분류:" 또는 "Classification:"
    //    예: "- 일반의약품(OTC)" 또는 "- OTC"
    const classMatch = infoText.match(/(?:분류|Classification)\s*:?\s*[-–\n\s]*(?:일반의약품)?\s*\(?(OTC|RX)\)?/i);
    if (classMatch) {
      result.classification = classMatch[1].toUpperCase() as 'OTC' | 'RX';
      if (result.classification === 'OTC') {
        result.classificationDesc = 'Available at Pharmacy without prescription';
      } else {
        result.classificationDesc = 'Requires doctor\'s prescription';
      }
    }

    // 3. 주요 용도 파싱 - "주요 용도:" 또는 "Primary Use:"
    //    예: "- 해열 및 진통" 또는 "- Antipyretic and analgesic"
    const useMatch = infoText.match(/(?:주요\s*용도|Primary\s*Use)\s*:?\s*[-–\n\s]*([^\n]+)/i);
    if (useMatch) {
      result.primaryUse = useMatch[1].trim();
    }

    // 4. 안전성 확인 파싱 - "안전성 확인" 또는 "Safety Check"
    //    예: "안전" 또는 "SAFE"
    const safetyMatch = infoText.match(/(?:안전성\s*확인|Safety\s*Check)[^:]*:?\s*(?:안전|SAFE)/i);
    if (safetyMatch) {
      result.safetyStatus = 'SAFE';
    } else {
      result.safetyStatus = 'SAFE'; // 기본값
    }

    // 5. 알러지 정보 파싱 - "알러지:" 부분에서 추출
    //    예: "안전성 확인 (알러지: Penicillin):" → "Penicillin"
    const allergyMatch = infoText.match(/(?:알러지|Allergy)\s*:\s*([^\)]+)\)/i);
    if (allergyMatch) {
      const allergyText = allergyMatch[1].trim();
      result.allergyInfo = allergyText;
      
      // 안전/SAFE가 명시되어 있으면 SAFE로 설정
      if (infoText.match(/(?:안전성\s*확인[^:]*:[^-]*-\s*안전|Safety\s*Check[^:]*:[^-]*-\s*SAFE)/i)) {
        result.safetyStatus = 'SAFE';
      }
    } else {
      result.allergyInfo = 'None';
      result.safetyStatus = 'SAFE';
    }

    // 6. 예상 가격 파싱 - "예상 가격" 또는 "Est. Price"
    //    예: "3,000 ~ 8,000원" 또는 "3,000 ~ 8,000 KRW"
    const priceMatch = infoText.match(/(?:예상\s*가격|Est\.\s*Price)[^:]*:?\s*[-–\n\s]*([^\n]+)/i);
    if (priceMatch) {
      result.priceRange = priceMatch[1].trim();
    } else {
      result.priceRange = 'Contact pharmacy';
    }

    // 7. 복용 팁 파싱 - "복용 팁:" 또는 "Usage Tip:"
    //    동일 주성분 섹션 전까지 읽기
    const tipMatch = infoText.match(/(?:복용\s*팁|Usage\s*Tip)\s*:?\s*[-–\n\s]*([\s\S]*?)(?:\n\s*7\.|\n\s*\*|$)/i);
    if (tipMatch) {
      result.usageTip = tipMatch[1].trim().replace(/\s*-\s*/g, '\n• ');
    } else {
      result.usageTip = 'Consult a pharmacist';
    }

    // 8. 동일 주성분 약품 파싱 - "동일 주성분 약:" 또는 "Medicines with Same Active Ingredient:"
    //    예: "- 판피린 (동화약품)\n- 펜잘 (한미약품)"
    //    또는 "\n- paracetamol (Samjin Pharmaceutical)\n- paracetamol (Hanmi Pharmaceutical)"
    const altMatch = infoText.match(/(?:동일\s*주성분\s*약|Medicines\s*with\s*Same\s*Active\s*Ingredient)\s*:?\s*([\s\S]*?)(?:\n\s*\*|\* Disclaimer|$)/i);
    if (altMatch) {
      let altText = altMatch[1].trim();
      
      // \n 문자열 리터럴을 실제 줄바꿈으로 변환
      altText = altText.replace(/\\n/g, '\n');
      
      // 줄바꿈으로 분리하고 각 항목 정리
      const alternatives = altText
        .split('\n')
        .map(line => line.replace(/^[\s-]+/, '').trim())  // 앞의 공백, 하이픈 제거
        .filter(line => line.length > 0 && !line.startsWith('*') && !line.includes('Disclaimer'));  // 빈 줄, 주의사항 제외
      result.alternatives = alternatives;
      
      console.log('🔍 Parsed alternatives:', alternatives);
    }
  } catch (error) {
    console.error('의약품 정보 파싱 오류:', error);
  }

  return result;
}

// 의약품 API
export const medicineAPI = {
  // 의약품 검색
  searchMedicine: async (request: SearchMedicineRequest): Promise<SearchMedicineResponse> => {
    const response = await apiClient.post('/api/search-medicine', request);
    return response.data;
  },
};
