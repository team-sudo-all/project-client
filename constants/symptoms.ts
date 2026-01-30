import { SymptomCategory } from '@/types/symptom';

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: 'stomach',
    icon: '🫃',
    label: {
      ko: '복통',
      en: 'Stomach Pain',
      zh: '腹痛',
      vi: 'Đau bụng',
    },
    subSymptoms: [
      {
        id: 'stomach-pain',
        categoryId: 'stomach',
        label: {
          ko: '복부 통증',
          en: 'Abdominal pain',
          zh: '腹部疼痛',
          vi: 'Đau vùng bụng',
        },
        severity: 'moderate',
      },
      {
        id: 'stomach-nausea',
        categoryId: 'stomach',
        label: {
          ko: '메스꺼움',
          en: 'Nausea',
          zh: '恶心',
          vi: 'Buồn nôn',
        },
        severity: 'mild',
      },
      {
        id: 'stomach-diarrhea',
        categoryId: 'stomach',
        label: {
          ko: '설사',
          en: 'Diarrhea',
          zh: '腹泻',
          vi: 'Tiêu chảy',
        },
        severity: 'moderate',
      },
      {
        id: 'stomach-vomiting',
        categoryId: 'stomach',
        label: {
          ko: '구토',
          en: 'Vomiting',
          zh: '呕吐',
          vi: 'Nôn',
        },
        severity: 'moderate',
      },
    ],
  },
  {
    id: 'headache',
    icon: '🤕',
    label: {
      ko: '두통',
      en: 'Headache',
      zh: '头痛',
      vi: 'Đau đầu',
    },
    subSymptoms: [
      {
        id: 'headache-mild',
        categoryId: 'headache',
        label: {
          ko: '가벼운 두통',
          en: 'Mild headache',
          zh: '轻微头痛',
          vi: 'Đau đầu nhẹ',
        },
        severity: 'mild',
      },
      {
        id: 'headache-severe',
        categoryId: 'headache',
        label: {
          ko: '심한 두통',
          en: 'Severe headache',
          zh: '严重头痛',
          vi: 'Đau đầu dữ dội',
        },
        severity: 'severe',
      },
      {
        id: 'headache-migraine',
        categoryId: 'headache',
        label: {
          ko: '편두통',
          en: 'Migraine',
          zh: '偏头痛',
          vi: 'Đau nửa đầu',
        },
        severity: 'moderate',
      },
      {
        id: 'headache-dizziness',
        categoryId: 'headache',
        label: {
          ko: '어지러움',
          en: 'Dizziness',
          zh: '头晕',
          vi: 'Chóng mặt',
        },
        severity: 'moderate',
      },
    ],
  },
  {
    id: 'toothache',
    icon: '🦷',
    label: {
      ko: '치통',
      en: 'Toothache',
      zh: '牙痛',
      vi: 'Đau răng',
    },
    subSymptoms: [
      {
        id: 'toothache-pain',
        categoryId: 'toothache',
        label: {
          ko: '치아 통증',
          en: 'Tooth pain',
          zh: '牙齿疼痛',
          vi: 'Đau răng',
        },
        severity: 'moderate',
      },
      {
        id: 'toothache-gum',
        categoryId: 'toothache',
        label: {
          ko: '잇몸 통증',
          en: 'Gum pain',
          zh: '牙龈疼痛',
          vi: 'Đau nướu',
        },
        severity: 'mild',
      },
      {
        id: 'toothache-sensitivity',
        categoryId: 'toothache',
        label: {
          ko: '시린 이',
          en: 'Tooth sensitivity',
          zh: '牙齿敏感',
          vi: 'Răng nhạy cảm',
        },
        severity: 'mild',
      },
    ],
  },
  {
    id: 'cold',
    icon: '🤧',
    label: {
      ko: '감기 증상',
      en: 'Cold Symptoms',
      zh: '感冒症状',
      vi: 'Triệu chứng cảm lạnh',
    },
    subSymptoms: [
      {
        id: 'cold-runny-nose',
        categoryId: 'cold',
        label: {
          ko: '콧물',
          en: 'Runny nose',
          zh: '流鼻涕',
          vi: 'Sổ mũi',
        },
        severity: 'mild',
      },
      {
        id: 'cold-sore-throat',
        categoryId: 'cold',
        label: {
          ko: '목아픔',
          en: 'Sore throat',
          zh: '咽喉痛',
          vi: 'Đau họng',
        },
        severity: 'mild',
      },
      {
        id: 'cold-cough',
        categoryId: 'cold',
        label: {
          ko: '기침',
          en: 'Cough',
          zh: '咳嗽',
          vi: 'Ho',
        },
        severity: 'mild',
      },
      {
        id: 'cold-fever',
        categoryId: 'cold',
        label: {
          ko: '발열',
          en: 'Fever',
          zh: '发烧',
          vi: 'Sốt',
        },
        severity: 'moderate',
      },
      {
        id: 'cold-chills',
        categoryId: 'cold',
        label: {
          ko: '오한',
          en: 'Chills',
          zh: '发冷',
          vi: 'Ớn lạnh',
        },
        severity: 'moderate',
      },
    ],
  },
  {
    id: 'joint-muscle',
    icon: '💪',
    label: {
      ko: '관절/근육통',
      en: 'Joint/Muscle Pain',
      zh: '关节/肌肉痛',
      vi: 'Đau khớp/cơ',
    },
    subSymptoms: [
      {
        id: 'joint-pain',
        categoryId: 'joint-muscle',
        label: {
          ko: '관절 통증',
          en: 'Joint pain',
          zh: '关节疼痛',
          vi: 'Đau khớp',
        },
        severity: 'moderate',
      },
      {
        id: 'muscle-pain',
        categoryId: 'joint-muscle',
        label: {
          ko: '근육통',
          en: 'Muscle pain',
          zh: '肌肉疼痛',
          vi: 'Đau cơ',
        },
        severity: 'moderate',
      },
      {
        id: 'back-pain',
        categoryId: 'joint-muscle',
        label: {
          ko: '허리 통증',
          en: 'Back pain',
          zh: '腰痛',
          vi: 'Đau lưng',
        },
        severity: 'moderate',
      },
      {
        id: 'neck-pain',
        categoryId: 'joint-muscle',
        label: {
          ko: '목/어깨 통증',
          en: 'Neck/Shoulder pain',
          zh: '颈肩痛',
          vi: 'Đau cổ/vai',
        },
        severity: 'mild',
      },
    ],
  },
  {
    id: 'skin',
    icon: '🩺',
    label: {
      ko: '피부 문제',
      en: 'Skin Problems',
      zh: '皮肤问题',
      vi: 'Vấn đề da',
    },
    subSymptoms: [
      {
        id: 'skin-rash',
        categoryId: 'skin',
        label: {
          ko: '발진',
          en: 'Rash',
          zh: '皮疹',
          vi: 'Phát ban',
        },
        severity: 'mild',
      },
      {
        id: 'skin-itching',
        categoryId: 'skin',
        label: {
          ko: '가려움',
          en: 'Itching',
          zh: '瘙痒',
          vi: 'Ngứa',
        },
        severity: 'mild',
      },
      {
        id: 'skin-swelling',
        categoryId: 'skin',
        label: {
          ko: '부종',
          en: 'Swelling',
          zh: '肿胀',
          vi: 'Sưng',
        },
        severity: 'moderate',
      },
      {
        id: 'skin-acne',
        categoryId: 'skin',
        label: {
          ko: '여드름/뾰루지',
          en: 'Acne/Pimples',
          zh: '痤疮/粉刺',
          vi: 'Mụn trứng cá',
        },
        severity: 'mild',
      },
    ],
  },
  {
    id: 'urinary',
    icon: '🚽',
    label: {
      ko: '비뇨기 증상',
      en: 'Urinary Symptoms',
      zh: '泌尿系统症状',
      vi: 'Triệu chứng tiết niệu',
    },
    subSymptoms: [
      {
        id: 'urinary-frequent',
        categoryId: 'urinary',
        label: {
          ko: '잦은 소변',
          en: 'Frequent urination',
          zh: '尿频',
          vi: 'Đi tiểu thường xuyên',
        },
        severity: 'mild',
      },
      {
        id: 'urinary-pain',
        categoryId: 'urinary',
        label: {
          ko: '배뇨통',
          en: 'Painful urination',
          zh: '排尿疼痛',
          vi: 'Đau khi đi tiểu',
        },
        severity: 'moderate',
      },
      {
        id: 'urinary-blood',
        categoryId: 'urinary',
        label: {
          ko: '혈뇨',
          en: 'Blood in urine',
          zh: '血尿',
          vi: 'Tiểu ra máu',
        },
        severity: 'severe',
      },
    ],
  },
  {
    id: 'mental',
    icon: '🧠',
    label: {
      ko: '정신 건강',
      en: 'Mental Health',
      zh: '心理健康',
      vi: 'Sức khỏe tâm thần',
    },
    subSymptoms: [
      {
        id: 'mental-anxiety',
        categoryId: 'mental',
        label: {
          ko: '불안감',
          en: 'Anxiety',
          zh: '焦虑',
          vi: 'Lo âu',
        },
        severity: 'moderate',
      },
      {
        id: 'mental-depression',
        categoryId: 'mental',
        label: {
          ko: '우울감',
          en: 'Depression',
          zh: '抑郁',
          vi: 'Trầm cảm',
        },
        severity: 'moderate',
      },
      {
        id: 'mental-insomnia',
        categoryId: 'mental',
        label: {
          ko: '불면증',
          en: 'Insomnia',
          zh: '失眠',
          vi: 'Mất ngủ',
        },
        severity: 'mild',
      },
      {
        id: 'mental-stress',
        categoryId: 'mental',
        label: {
          ko: '스트레스',
          en: 'Stress',
          zh: '压力',
          vi: 'Căng thẳng',
        },
        severity: 'mild',
      },
    ],
  },
  {
    id: 'injury',
    icon: '🩹',
    label: {
      ko: '부상/사고',
      en: 'Injuries/Accidents',
      zh: '外伤/事故',
      vi: 'Chấn thương/Tai nạn',
    },
    subSymptoms: [
      {
        id: 'injury-cut',
        categoryId: 'injury',
        label: {
          ko: '베임/찰과상',
          en: 'Cut/Abrasion',
          zh: '割伤/擦伤',
          vi: 'Vết cắt/Trầy xước',
        },
        severity: 'mild',
      },
      {
        id: 'injury-sprain',
        categoryId: 'injury',
        label: {
          ko: '삔/염좌',
          en: 'Sprain',
          zh: '扭伤',
          vi: 'Bong gân',
        },
        severity: 'moderate',
      },
      {
        id: 'injury-fracture',
        categoryId: 'injury',
        label: {
          ko: '골절 의심',
          en: 'Suspected fracture',
          zh: '疑似骨折',
          vi: 'Nghi gãy xương',
        },
        severity: 'severe',
      },
      {
        id: 'injury-burn',
        categoryId: 'injury',
        label: {
          ko: '화상',
          en: 'Burn',
          zh: '烧伤',
          vi: 'Bỏng',
        },
        severity: 'moderate',
      },
    ],
  },
  {
    id: 'others',
    icon: '❓',
    label: {
      ko: '기타',
      en: 'Others',
      zh: '其他',
      vi: 'Khác',
    },
    subSymptoms: [
      {
        id: 'others-fatigue',
        categoryId: 'others',
        label: {
          ko: '피로감',
          en: 'Fatigue',
          zh: '疲劳',
          vi: 'Mệt mỏi',
        },
        severity: 'mild',
      },
      {
        id: 'others-appetite',
        categoryId: 'others',
        label: {
          ko: '식욕 변화',
          en: 'Appetite changes',
          zh: '食欲变化',
          vi: 'Thay đổi khẩu vị',
        },
        severity: 'mild',
      },
      {
        id: 'others-weight',
        categoryId: 'others',
        label: {
          ko: '체중 변화',
          en: 'Weight changes',
          zh: '体重变化',
          vi: 'Thay đổi cân nặng',
        },
        severity: 'mild',
      },
      {
        id: 'others-other',
        categoryId: 'others',
        label: {
          ko: '기타 증상',
          en: 'Other symptoms',
          zh: '其他症状',
          vi: 'Triệu chứng khác',
        },
        severity: 'mild',
      },
    ],
  },
];
