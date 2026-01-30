'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { SYMPTOM_CATEGORIES } from '@/constants/symptoms';
import { useChartStore } from '@/lib/stores/chartStore';
import { chartAPI } from '@/lib/api/chart';

interface SymptomFields {
  mainSymptoms: string;
  duration: string;
  painLocation: string;
  accompanyingSymptoms: string;
  medicalHistory: string;
  otherNotes: string;
}

export default function SymptomsDetailPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { setChartText } = useChartStore();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 개별 입력 필드 상태
  const [fields, setFields] = useState<SymptomFields>({
    mainSymptoms: '',
    duration: '',
    painLocation: '',
    accompanyingSymptoms: '',
    medicalHistory: '',
    otherNotes: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    setUserId(user.user_id);

    const stored = sessionStorage.getItem('selectedCategories');
    if (stored) {
      setSelectedCategories(JSON.parse(stored));
    } else {
      router.push('/symptoms');
    }
  }, [router]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language as 'ko' | 'en' | 'zh' | 'vi';

  const getSelectedCategoryNames = () => {
    return selectedCategories
      .map((id) => {
        const category = SYMPTOM_CATEGORIES.find((c) => c.id === id);
        return category?.label[currentLang] || category?.label.en || id;
      })
      .join(', ');
  };

  // 필드 업데이트 핸들러
  const updateField = (key: keyof SymptomFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  // 입력 필드를 하나의 설명 텍스트로 합치기
  const combineFieldsToDescription = (): string => {
    const parts: string[] = [];

    if (fields.mainSymptoms.trim()) {
      parts.push(`[주요 증상] ${fields.mainSymptoms.trim()}`);
    }
    if (fields.duration.trim()) {
      parts.push(`[증상 지속 기간] ${fields.duration.trim()}`);
    }
    if (fields.painLocation.trim()) {
      parts.push(`[통증 위치와 강도] ${fields.painLocation.trim()}`);
    }
    if (fields.accompanyingSymptoms.trim()) {
      parts.push(`[동반 증상] ${fields.accompanyingSymptoms.trim()}`);
    }
    if (fields.medicalHistory.trim()) {
      parts.push(`[기존 병력/복용 약물] ${fields.medicalHistory.trim()}`);
    }
    if (fields.otherNotes.trim()) {
      parts.push(`[기타사항] ${fields.otherNotes.trim()}`);
    }

    return parts.join('\n\n');
  };

  // 최소 1개 필드가 입력되었는지 확인
  const hasAnyInput = () => {
    return Object.values(fields).some((value) => value.trim().length > 0);
  };

  // API 호출
  const handleSummarize = async () => {
    if (!hasAnyInput()) {
      alert(t('symptoms.noInput'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const symptomNames = selectedCategories.map((id) => {
        const category = SYMPTOM_CATEGORIES.find((c) => c.id === id);
        return category?.label.ko || id;
      });

      const combinedDescription = combineFieldsToDescription();

      const response = await chartAPI.generateChart({
        user_id: userId,
        selected_symptoms: symptomNames,
        detail_description: combinedDescription,
      });

      setChartText(response.chart);
      router.push('/symptoms/chart');
    } catch (err: any) {
      console.error('차트 생성 실패:', err);
      setError(err.response?.data?.detail || '차트 생성에 실패했습니다.');
      setIsLoading(false);
    }
  };

  // 입력 필드 설정
  const inputFields = [
    {
      key: 'mainSymptoms' as keyof SymptomFields,
      label: t('symptoms.field.mainSymptoms'),
      labelEn: 'Main Symptoms',
      placeholder: i18n.language === 'ko' 
        ? '예: 머리가 지끈거리고 욱신거립니다' 
        : 'e.g., Throbbing and pulsating headache',
      rows: 2,
    },
    {
      key: 'duration' as keyof SymptomFields,
      label: t('symptoms.field.duration'),
      labelEn: 'Duration',
      placeholder: i18n.language === 'ko' 
        ? '예: 어제 저녁부터 약 12시간째' 
        : 'e.g., About 12 hours since last evening',
      rows: 1,
    },
    {
      key: 'painLocation' as keyof SymptomFields,
      label: t('symptoms.field.painLocation'),
      labelEn: 'Pain Location & Intensity',
      placeholder: i18n.language === 'ko' 
        ? '예: 오른쪽 관자놀이 부근, 10점 만점에 7점 정도' 
        : 'e.g., Near right temple, about 7 out of 10',
      rows: 2,
    },
    {
      key: 'accompanyingSymptoms' as keyof SymptomFields,
      label: t('symptoms.field.accompanyingSymptoms'),
      labelEn: 'Accompanying Symptoms',
      placeholder: i18n.language === 'ko' 
        ? '예: 메스꺼움, 빛에 민감함' 
        : 'e.g., Nausea, sensitivity to light',
      rows: 2,
    },
    {
      key: 'medicalHistory' as keyof SymptomFields,
      label: t('symptoms.field.medicalHistory'),
      labelEn: 'Medical History / Medications',
      placeholder: i18n.language === 'ko' 
        ? '예: 고혈압 약 복용 중, 아스피린 알러지' 
        : 'e.g., Taking blood pressure medication, allergic to aspirin',
      rows: 2,
    },
    {
      key: 'otherNotes' as keyof SymptomFields,
      label: t('symptoms.field.otherNotes'),
      labelEn: 'Other Notes',
      placeholder: i18n.language === 'ko' 
        ? '예: 최근 스트레스가 많았음, 수면 부족' 
        : 'e.g., High stress recently, lack of sleep',
      rows: 2,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('symptoms.generating')}
              </h2>
              <p className="mt-2 text-gray-500">
                {t('symptoms.generatingDesc')}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/symptoms"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('symptoms.back')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'ko' ? 'EN' : '한국어'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col px-6 py-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('symptoms.detailTitle')}</h1>
            <p className="mt-2 text-gray-600">{t('symptoms.detailSubtitle')}</p>
          </div>

          {/* Selected Symptoms Summary */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              {t('symptoms.selectedSymptoms')}:
            </p>
            <p className="mt-1 text-blue-700">{getSelectedCategoryNames()}</p>
          </div>

          {/* Input Fields */}
          <div className="mb-8 space-y-5">
            {inputFields.map((field) => (
              <div key={field.key} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {field.label || field.labelEn}
                </label>
                <textarea
                  value={fields[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSummarize}
              disabled={isLoading || !hasAnyInput()}
              className="min-w-[200px] py-6 text-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('symptoms.generating')}
                </>
              ) : (
                t('symptoms.summarize')
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        {t('home.footer')}
      </footer>
    </div>
  );
}
