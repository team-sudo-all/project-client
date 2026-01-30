'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Globe, Loader2, AlertCircle, Pill, ShieldCheck, ShieldAlert, DollarSign, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { medicineAPI, parseMedicineInfo, ParsedMedicineInfo } from '@/lib/api/medicine';

function MedicineResultContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<ParsedMedicineInfo | null>(null);
  const [noResult, setNoResult] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [rawText, setRawText] = useState<string>('');
  
  // API 응답 전체 저장 (한국어 + 영어)
  const [apiResponse, setApiResponse] = useState<{
    medicine_info_kr: string;
    medicine_info_en: string;
    image_url?: string | null;
  } | null>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  // API 호출 - keyword가 변경될 때만 실행
  useEffect(() => {
    const fetchMedicineInfo = async () => {
      if (!keyword) {
        router.push('/medicine');
        return;
      }

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(storedUser);

      setIsLoading(true);
      setError(null);
      setNoResult(false);

      try {
        const response = await medicineAPI.searchMedicine({
          user_id: user.user_id,
          keyword: keyword,
        });

        // 디버깅 로그
        console.log('🔍 API Response:', response);
        console.log('🖼️ Image URL:', response.image_url);

        // API 응답 전체 저장 (한국어 + 영어 모두)
        setApiResponse(response);

        // 이미지 URL 저장 (null 체크 포함)
        if (response.image_url && response.image_url !== null) {
          console.log('✅ Setting image URL:', response.image_url);
          setImageUrl(response.image_url);
        } else {
          console.log('⚠️ No image URL in response');
          setImageUrl(null);
        }

        // 현재 언어에 맞는 텍스트 선택 및 파싱
        const infoText = i18n.language === 'ko' 
          ? (response.medicine_info_kr || response.medicine_info_en)
          : (response.medicine_info_en || response.medicine_info_kr);
        
        setRawText(infoText);
        console.log('📝 Info Text:', infoText);
        
        const parsed = parseMedicineInfo(infoText);
        console.log('📊 Parsed Result:', parsed);
        
        if (infoText && infoText.length > 0) {
          setMedicineInfo(parsed);
          setNoResult(false);
        } else {
          setNoResult(true);
        }
      } catch (err: any) {
        console.error('의약품 검색 실패:', err);
        console.error('에러 상세:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
        });
        
        if (err.response?.status === 404 || err.response?.data?.detail?.includes('not found')) {
          setNoResult(true);
        } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        } else {
          setError(err.response?.data?.detail || err.message || '의약품 정보를 가져오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicineInfo();
  }, [keyword, router]); // ← i18n.language 제거!

  // 언어 변경 시 - 저장된 API 응답에서 해당 언어 정보만 다시 파싱 (API 재호출 없음)
  useEffect(() => {
    if (!apiResponse) return;

    const infoText = i18n.language === 'ko' 
      ? (apiResponse.medicine_info_kr || apiResponse.medicine_info_en)
      : (apiResponse.medicine_info_en || apiResponse.medicine_info_kr);
    
    setRawText(infoText);
    
    const parsed = parseMedicineInfo(infoText);
    setMedicineInfo(parsed);
    
    console.log('🌐 Language changed to:', i18n.language);
    console.log('📊 Re-parsed Result:', parsed);
  }, [i18n.language, apiResponse]);

  // 로딩 화면
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header toggleLanguage={toggleLanguage} i18n={i18n} />
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <Loader2 className="h-12 w-12 animate-spin text-green-500" />
          <p className="mt-4 text-gray-600">
            {i18n.language === 'ko' ? '의약품 정보를 검색하고 있습니다...' : 'Searching for medication information...'}
          </p>
        </main>
      </div>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header toggleLanguage={toggleLanguage} i18n={i18n} />
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {i18n.language === 'ko' ? '오류가 발생했습니다' : 'An error occurred'}
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button
              onClick={() => router.push('/medicine')}
              className="mt-6 bg-green-600 hover:bg-green-700"
            >
              {i18n.language === 'ko' ? '다시 검색하기' : 'Search Again'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 검색 결과 없음 화면 (5-3)
  if (noResult) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header toggleLanguage={toggleLanguage} i18n={i18n} />
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="text-center max-w-md">
            {/* 느낌표 아이콘 */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <AlertCircle className="h-10 w-10 text-gray-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {i18n.language === 'ko' 
                ? '검색 결과가 없습니다' 
                : 'No Results Found'}
            </h2>
            
            <p className="text-gray-500 leading-relaxed mb-8">
              {i18n.language === 'ko' ? (
                <>
                  &quot;{keyword}&quot;에 대한 의약품 정보를 찾을 수 없습니다.
                  <br />
                  약품명을 확인하거나 성분명으로 검색해 보세요.
                </>
              ) : (
                <>
                  We couldn&apos;t find any information for &quot;{keyword}&quot;.
                  <br />
                  Please check the medication name or try searching by the active ingredient.
                </>
              )}
            </p>

            <Button
              onClick={() => router.push('/medicine')}
              className="bg-green-600 hover:bg-green-700 px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              {i18n.language === 'ko' ? '다시 검색하기' : 'Search Again'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 검색 결과 화면 (5-2)
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header toggleLanguage={toggleLanguage} i18n={i18n} />
      
      <main className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-2xl">
          {/* 약 이름 */}
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            {medicineInfo?.name.english || medicineInfo?.name.korean || keyword}
          </h1>

          {/* 메인 컨텐츠 - 2열 레이아웃 */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {/* 왼쪽: 약 이미지 */}
            <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
              {imageUrl && !imageError ? (
                <img 
                  src={imageUrl} 
                  alt={medicineInfo?.name.english || keyword}
                  className="w-full h-full object-contain p-4"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center p-4">
                  <Pill className="mx-auto h-16 w-16 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-400">
                    {i18n.language === 'ko' ? '이미지 없음' : 'No Image'}
                  </p>
                  {imageError && (
                    <p className="mt-1 text-xs text-gray-400">
                      {i18n.language === 'ko' ? '(로드 실패)' : '(Failed to load)'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 오른쪽: 동일 주성분 약품 */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 font-semibold text-gray-800">
                {i18n.language === 'ko' 
                  ? '동일 주성분 약품' 
                  : 'Medicines with Same Active Ingredient'}
              </h3>
              <ul className="space-y-2 text-sm">
                {medicineInfo?.alternatives && medicineInfo.alternatives.length > 0 ? (
                  medicineInfo.alternatives.map((alt, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>{alt}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">
                    {i18n.language === 'ko' 
                      ? '동일 주성분 약품 정보가 없습니다' 
                      : 'No alternative medications found'}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 약 정보 카드 */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            {/* 분류 (OTC/RX) */}
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                medicineInfo?.classification === 'OTC' 
                  ? 'bg-green-100 text-green-600' 
                  : medicineInfo?.classification === 'RX'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {medicineInfo?.classification === 'OTC' 
                    ? (i18n.language === 'ko' ? '일반의약품 (OTC)' : 'Over-the-Counter (OTC)')
                    : medicineInfo?.classification === 'RX'
                    ? (i18n.language === 'ko' ? '전문의약품 (RX)' : 'Prescription (RX)')
                    : (i18n.language === 'ko' ? '분류 정보 없음' : 'Classification Unknown')}
                </p>
                <p className="text-sm text-gray-500">
                  {medicineInfo?.classification === 'OTC'
                    ? (i18n.language === 'ko' ? '처방전 없이 약국에서 구매 가능' : 'Can be purchased at pharmacies without a prescription')
                    : medicineInfo?.classification === 'RX'
                    ? (i18n.language === 'ko' ? '의사 처방전이 필요합니다' : 'Requires a doctor\'s prescription')
                    : ''}
                </p>
              </div>
            </div>

            {/* 주요 성분/용도 */}
            {medicineInfo?.primaryUse && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {i18n.language === 'ko' ? '주요 용도' : 'Primary Use'}
                  </p>
                  <p className="text-sm text-gray-600">{medicineInfo.primaryUse}</p>
                </div>
              </div>
            )}

            {/* 안전성 / 알러지 */}
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                medicineInfo?.safetyStatus === 'SAFE' 
                  ? 'bg-green-100 text-green-600' 
                  : medicineInfo?.safetyStatus === 'CAUTION'
                  ? 'bg-yellow-100 text-yellow-600'
                  : medicineInfo?.safetyStatus === 'WARNING'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {medicineInfo?.safetyStatus === 'SAFE' 
                  ? <ShieldCheck className="h-5 w-5" />
                  : <ShieldAlert className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {i18n.language === 'ko' ? '알러지 위험 성분' : 'Potential Allergens'}
                </p>
                <p className="text-sm text-gray-600">
                  {(!medicineInfo?.allergyInfo || 
                    medicineInfo.allergyInfo === 'None' || 
                    medicineInfo.allergyInfo === '없음' ||
                    medicineInfo.allergyInfo.toLowerCase() === 'none')
                    ? (i18n.language === 'ko' ? '없음' : 'None')
                    : medicineInfo.allergyInfo}
                </p>
              </div>
            </div>

            {/* 가격 */}
            {medicineInfo?.priceRange && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {i18n.language === 'ko' ? '예상 가격 (한국)' : 'Estimated Price (Korea)'}
                  </p>
                  <p className="text-sm text-gray-600">{medicineInfo.priceRange}</p>
                </div>
              </div>
            )}

            {/* 복용 팁 */}
            {medicineInfo?.usageTip && (
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  💡 {i18n.language === 'ko' ? '복용 팁' : 'Usage Tips'}
                </p>
                <p className="text-sm text-blue-700 whitespace-pre-line">{medicineInfo.usageTip}</p>
              </div>
            )}
          </div>

          {/* 하단 경고 */}
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">
              {i18n.language === 'ko' 
                ? '가격은 한국 평균 기준이며, 판매처에 따라 다를 수 있습니다. AI 추정치이므로 약사와 상담하세요.'
                : 'Prices shown are based on the average range in Korea and may vary depending on the seller. This is an AI estimate - please consult a pharmacist.'}
            </p>
          </div>

          {/* 다시 검색 버튼 */}
          <Button
            onClick={() => router.push('/medicine')}
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50"
          >
            <Search className="mr-2 h-4 w-4" />
            {i18n.language === 'ko' ? '다른 약 검색하기' : 'Search Another Medication'}
          </Button>
        </div>
      </main>
    </div>
  );
}

// Header Component
function Header({ toggleLanguage, i18n }: { toggleLanguage: () => void; i18n: any }) {
  return (
    <header className="bg-blue-50 px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link
          href="/medicine"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {i18n.language === 'ko' ? '이전' : 'Back'}
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
  );
}

// Suspense wrapper for useSearchParams
export default function MedicineResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    }>
      <MedicineResultContent />
    </Suspense>
  );
}
