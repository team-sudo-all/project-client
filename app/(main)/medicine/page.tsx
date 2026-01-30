'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Globe, Search, Pill, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MedicineSearchPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    setIsSearching(true);
    // URL 파라미터로 검색어 전달
    router.push(`/medicine/result?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
      <main className="flex flex-1 flex-col items-center px-6 py-12">
        {/* Title with Icon */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Pill className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {i18n.language === 'ko' ? '의약품 검색' : 'Medication Search'}
          </h1>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-md">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={i18n.language === 'ko' 
                ? '약품명 또는 증상을 입력하세요' 
                : 'Enter medication name or symptom'}
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-4 pl-12 pr-4 text-base outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
              autoFocus
            />
          </div>

          {/* Guide Box */}
          <div className="mb-8 rounded-xl border-2 border-green-200 bg-green-50 p-5">
            <p className="text-center text-sm leading-relaxed text-green-800">
              {i18n.language === 'ko' ? (
                <>
                  찾고 있는 의약품을 검색하세요.
                  <br /><br />
                  한국에서 구매하는 방법과 동일 성분의 
                  <br />
                  대체 의약품을 안내해 드립니다.
                </>
              ) : (
                <>
                  Search for the medication you&apos;re looking for.
                  <br /><br />
                  We&apos;ll show you how to purchase it in Korea and 
                  <br />
                  recommend equivalent medications with the same active ingredients.
                </>
              )}
            </p>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!keyword.trim() || isSearching}
            className="w-full bg-green-600 py-6 text-lg font-semibold hover:bg-green-700 disabled:bg-gray-300"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {i18n.language === 'ko' ? '검색 중...' : 'Searching...'}
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                {i18n.language === 'ko' ? '검색하기' : 'Search'}
              </>
            )}
          </Button>
        </div>

        {/* Recent Searches (Optional - can be implemented later) */}
        {/* 
        <div className="mt-8 w-full max-w-md">
          <p className="mb-3 text-sm font-medium text-gray-500">
            {i18n.language === 'ko' ? '최근 검색' : 'Recent Searches'}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">타이레놀</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">Advil</span>
          </div>
        </div>
        */}
      </main>
    </div>
  );
}
