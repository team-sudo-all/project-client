'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Download, Pencil, Check, X, MapPin, Loader2 } from 'lucide-react';
import { useChartStore } from '@/lib/stores/chartStore';
import { useSymptomStore } from '@/lib/stores/symptomStore';
import { chartAPI } from '@/lib/api/chart';
import { SYMPTOM_CATEGORIES } from '@/constants/symptoms';
import dynamic from 'next/dynamic';

// dom-to-image-more는 클라이언트에서만 로드
let domtoimage: any = null;
if (typeof window !== 'undefined') {
  domtoimage = require('dom-to-image-more');
}

export default function ChartResultPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);
  
  const { chartText, updateChartText, clearChart } = useChartStore();
  const { freeText, clear: clearSymptoms } = useSymptomStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [chartDate, setChartDate] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSavingChart, setIsSavingChart] = useState(false);
  
  // 예상 진료비 관련 상태
  const [insuranceType, setInsuranceType] = useState<'NHIS' | 'Private' | null>(null);
  const [isLoadingCost, setIsLoadingCost] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    setUserId(user.user_id);

    // 선택된 카테고리 불러오기
    const storedCategories = sessionStorage.getItem('selectedCategories');
    if (storedCategories) {
      setSelectedCategories(JSON.parse(storedCategories));
    }

    if (!chartText) {
      router.push('/symptoms');
      return;
    }

    setEditedText(chartText);
    
    // 차트 작성 날짜 설정
    const now = new Date();
    const dateStr = now.toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setChartDate(dateStr);

    // 예상 진료비 API 호출 - 보험 타입만 추출
    const fetchCostEstimate = async () => {
      setIsLoadingCost(true);
      try {
        const response = await chartAPI.estimateCost(user.user_id);
        // API 응답에서 보험 타입 추출
        const costText = response.cost_guide;
        if (costText.includes('NHIS') || costText.includes('National Health Insurance')) {
          setInsuranceType('NHIS');
        } else if (costText.includes('Private')) {
          setInsuranceType('Private');
        } else {
          setInsuranceType('NHIS'); // 기본값
        }
      } catch (error) {
        console.error('예상 진료비 조회 실패:', error);
        setInsuranceType('NHIS'); // 실패 시 기본값
      } finally {
        setIsLoadingCost(false);
      }
    };
    fetchCostEstimate();
  }, [router, chartText, i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(chartText || '');
  };

  const handleSaveEdit = () => {
    updateChartText(editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(chartText || '');
    setIsEditing(false);
  };

  // 이미지로 저장
  const handleSaveAsImage = async () => {
    if (!chartRef.current || !domtoimage) {
      alert(i18n.language === 'ko' ? '이미지 저장 기능을 불러오는 중입니다.' : 'Loading image save feature.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    // 캡처 전 스타일 저장 및 제거
    const originalStyles = {
      boxShadow: chartRef.current.style.boxShadow,
      borderRadius: chartRef.current.style.borderRadius,
      border: chartRef.current.style.border,
      outline: chartRef.current.style.outline,
    };
    
    chartRef.current.style.boxShadow = 'none';
    chartRef.current.style.borderRadius = '0';
    chartRef.current.style.border = 'none';
    chartRef.current.style.outline = 'none';
    chartRef.current.classList.remove('shadow-lg');

    try {
      const domToImageLib = domtoimage.default || domtoimage;
      const dataUrl = await domToImageLib.toPng(chartRef.current, {
        quality: 1,
        bgcolor: '#f0f9ff',
        style: {
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        },
      });

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `Na-um_의료차트_${dateStr}.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert(i18n.language === 'ko' ? '이미지 저장에 실패했습니다.' : 'Failed to save image.');
    } finally {
      // 원래 스타일 복원
      chartRef.current!.style.boxShadow = originalStyles.boxShadow;
      chartRef.current!.style.borderRadius = originalStyles.borderRadius;
      chartRef.current!.style.border = originalStyles.border;
      chartRef.current!.style.outline = originalStyles.outline;
      chartRef.current!.classList.add('shadow-lg');
      setIsSaving(false);
    }
  };

  const handleProceedToHospital = () => {
    router.push('/hospitals');
  };

  // 차트 저장 후 완료
  const handleComplete = async () => {
    setIsSavingChart(true);
    
    try {
      // 선택된 증상 이름들 (한국어)
      const symptomNames = selectedCategories.map((id) => {
        const category = SYMPTOM_CATEGORIES.find((c) => c.id === id);
        return category?.label.ko || id;
      });

      // 차트 저장 API 호출
      await chartAPI.saveChart({
        user_id: userId,
        symptoms: symptomNames,
        detail: freeText || '',
        final_chart_text: chartText || '',
      });

      // 상태 초기화
      clearChart();
      clearSymptoms();
      sessionStorage.removeItem('selectedCategories');
      router.push('/dashboard');
    } catch (error) {
      console.error('차트 저장 실패:', error);
      // 저장 실패해도 대시보드로 이동 (데모용)
      clearChart();
      clearSymptoms();
      sessionStorage.removeItem('selectedCategories');
      router.push('/dashboard');
    } finally {
      setIsSavingChart(false);
    }
  };

  if (!chartText) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 저장 성공 토스트 */}
      {saveSuccess && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 animate-bounce">
          <div className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-white shadow-lg">
            <Check className="h-5 w-5" />
            <span className="font-medium">
              {i18n.language === 'ko' ? '저장되었습니다!' : 'Saved!'}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/symptoms/detail"
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
            <h1 className="text-2xl font-bold text-gray-900">{t('symptoms.chartTitle')}</h1>
            <p className="mt-2 text-gray-600">{t('symptoms.chartSubtitle')}</p>
          </div>

          {/* Chart Display - 메모지 스타일 */}
          <div
            ref={chartRef}
            className="shadow-lg"
            style={{
              position: 'relative',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              borderRadius: '0.5rem',
              background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fcff 50%, #f0f9ff 100%)',
            }}
          >
            {/* 메모지 줄 패턴 */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.4,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, #93c5fd 28px)',
                backgroundSize: '100% 28px',
              }}
            />
            
            {/* 좌측 빨간 마진 선 */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '2rem',
                width: '2px',
                backgroundColor: '#fecaca',
                opacity: 0.4,
              }}
            />
            
            {/* 컨텐츠 */}
            <div style={{ position: 'relative', padding: '2rem', paddingLeft: '3rem' }}>
              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  style={{
                    height: '24rem',
                    width: '100%',
                    resize: 'none',
                    borderRadius: '0.25rem',
                    border: '1px solid #93c5fd',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                  }}
                />
              ) : (
                <>
                  <pre 
                    style={{
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: '1.75rem',
                      color: '#1f2937',
                      margin: 0,
                    }}
                  >
                    {chartText}
                  </pre>
                  
                  {/* 차트 작성 날짜 */}
                  <div 
                    style={{
                      marginTop: '2rem',
                      paddingTop: '1rem',
                      borderTop: '1px dashed #93c5fd',
                      textAlign: 'right',
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    }}
                  >
                    {i18n.language === 'ko' ? '작성일시' : 'Created'}: {chartDate}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chart Action Buttons - 수정/이미지저장 */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveEdit}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('symptoms.saveEdit')}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {t('symptoms.cancelEdit')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {t('symptoms.edit')}
                </Button>
                <Button
                  onClick={handleSaveAsImage}
                  variant="outline"
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isSaving ? t('symptoms.saving') : t('symptoms.saveAsImage')}
                </Button>
              </>
            )}
          </div>

          {/* 예상 진료비 섹션 */}
          {!isEditing && (
            <div className="mb-6">
              {/* 예상 진료비 타이틀 */}
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {i18n.language === 'ko' ? '💰 예상 진료비 안내' : '💰 Estimated Cost Guide'}
                </h2>
              </div>

              {isLoadingCost ? (
                <div className="mb-4 flex items-center justify-center rounded-lg bg-gray-100 py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                  <span className="ml-2 text-gray-600">
                    {i18n.language === 'ko' ? '진료비 산정 중...' : 'Calculating...'}
                  </span>
                </div>
              ) : (
                <>
                  {/* 보험 정보 배지 */}
                  <div className="mb-4 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
                      <span className="text-lg">🏥</span>
                      <span className="font-medium text-blue-800">
                        {i18n.language === 'ko' 
                          ? `보험: ${insuranceType === 'NHIS' ? '국민건강보험' : '민간보험'}`
                          : `Insurance: ${insuranceType === 'NHIS' ? 'National Health Insurance' : 'Private Insurance'}`}
                      </span>
                    </div>
                  </div>

                  {/* 진료비 카드들 */}
                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    {/* 동네 의원 카드 */}
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-md">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-2xl">🩺</span>
                        <h3 className="font-bold text-gray-800">
                          {i18n.language === 'ko' ? '동네 의원' : 'Local Clinic'}
                        </h3>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">
                        {i18n.language === 'ko' ? '진료만 받은 경우' : 'Consultation Only'}
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {insuranceType === 'NHIS' 
                          ? (i18n.language === 'ko' ? '5,000 ~ 15,000원' : '5,000~15,000 KRW')
                          : (i18n.language === 'ko' ? '10,000 ~ 30,000원' : '10,000~30,000 KRW')}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {i18n.language === 'ko' 
                          ? '✓ 의뢰서 불필요' 
                          : '✓ No referral needed'}
                      </p>
                    </div>

                    {/* 대학/종합병원 카드 */}
                    <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-md">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-2xl">💉</span>
                        <h3 className="font-bold text-gray-800">
                          {i18n.language === 'ko' ? '대학/종합병원' : 'General Hospital'}
                        </h3>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">
                        {i18n.language === 'ko' ? '검사 포함 시' : 'With Tests'}
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        {insuranceType === 'NHIS'
                          ? (i18n.language === 'ko' ? '20,000 ~ 50,000원+' : '20,000~50,000+ KRW')
                          : (i18n.language === 'ko' ? '50,000 ~ 150,000원+' : '50,000~150,000+ KRW')}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {insuranceType === 'NHIS'
                          ? (i18n.language === 'ko' ? '✓ 의뢰서 필요' : '✓ Referral needed')
                          : (i18n.language === 'ko' ? '✓ 의뢰서 불필요' : '✓ No referral needed')}
                      </p>
                    </div>
                  </div>

                  {/* 참고사항 */}
                  <div className="mb-4 rounded-lg bg-gray-100 p-4">
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        {i18n.language === 'ko' 
                          ? '※ 토요일 진료 시 소폭 할증이 적용될 수 있습니다.' 
                          : '※ Saturday visits may incur a slight surcharge.'}
                      </p>
                      <p>
                        {i18n.language === 'ko' 
                          ? `※ ${insuranceType === 'NHIS' ? '국민건강보험' : '민간보험'} 적용 기준입니다.`
                          : `※ Based on ${insuranceType === 'NHIS' ? 'National Health Insurance' : 'Private Insurance'}.`}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* 경고 메시지 박스 - 노란색 */}
              <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4 text-center">
                <p className="text-sm text-gray-700">
                  <span className="mr-1">⚠️</span>
                  {i18n.language === 'ko' 
                    ? '표시된 가격은 보험 정보 기반 예상 범위이며, 의사의 진단에 따라 달라질 수 있습니다.' 
                    : 'The prices shown are estimated ranges based on your insurance information and may vary depending on a doctor\'s diagnosis.'}
                </p>
              </div>
            </div>
          )}

          {/* Next Step Buttons - 병원추천/확인 */}
          {!isEditing && (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={handleProceedToHospital}
                className="flex items-center justify-center gap-2 py-6 text-lg"
                size="lg"
              >
                <MapPin className="h-5 w-5" />
                {t('symptoms.proceedToHospital')}
              </Button>
              <Button
                onClick={handleComplete}
                variant="outline"
                disabled={isSavingChart}
                className="py-6 text-lg"
                size="lg"
              >
                {isSavingChart ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {i18n.language === 'ko' ? '저장 중...' : 'Saving...'}
                  </>
                ) : (
                  t('symptoms.ok')
                )}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        {t('home.footer')}
      </footer>
    </div>
  );
}
