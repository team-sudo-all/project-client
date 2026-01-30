'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Check } from 'lucide-react';
import { SYMPTOM_CATEGORIES } from '@/constants/symptoms';
import { useSymptomStore } from '@/lib/stores/symptomStore';

export default function SymptomsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { selectedSymptoms, toggleSymptom, clear } = useSymptomStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // 로그인 확인
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    }
  }, [router]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const handleNext = () => {
    if (selectedCategories.length === 0) return;

    // 선택된 카테고리 정보를 sessionStorage에 저장
    sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    router.push('/symptoms/detail');
  };

  const currentLang = i18n.language as 'ko' | 'en' | 'zh' | 'vi';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/dashboard"
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
        <div className="mx-auto w-full max-w-3xl">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('symptoms.title')}</h1>
            <p className="mt-2 text-gray-600">{t('symptoms.subtitle')}</p>
          </div>

          {/* Selected Count */}
          {selectedCategories.length > 0 && (
            <div className="mb-6 text-center">
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                {t('symptoms.selectedCount', { count: selectedCategories.length })}
              </span>
            </div>
          )}

          {/* Symptom Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {SYMPTOM_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {/* Check Icon */}
                  {isSelected && (
                    <div className="absolute right-2 top-2">
                      <Check className="h-5 w-5 text-blue-500" />
                    </div>
                  )}

                  {/* Emoji Icon */}
                  <span className="text-4xl">{category.icon}</span>

                  {/* Label */}
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      {category.label[currentLang] || category.label.en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleNext}
              disabled={selectedCategories.length === 0}
              className="min-w-[200px] py-6 text-lg"
              size="lg"
            >
              {selectedCategories.length === 0
                ? t('symptoms.noSelection')
                : t('symptoms.next')}
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
