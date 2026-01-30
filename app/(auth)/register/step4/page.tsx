'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { authAPI } from '@/lib/api/auth';
import type { RegisterData, RegisterFormData } from '@/lib/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// 글로벌 건강 보험 목록
const GLOBAL_INSURANCE_OPTIONS = [
  'Cigna Global',
  'Bupa Global',
  'Allianz Care (Allianz)',
  'AXA Global Healthcare',
  'IMG (International Medical Group)',
  'GeoBlue',
];

export default function RegisterStep4() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [hasNationalInsurance, setHasNationalInsurance] = useState(false);
  const [selectedGlobalInsurance, setSelectedGlobalInsurance] = useState<string>('');
  const [otherInsurance, setOtherInsurance] = useState('');

  // 알러지 정보
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);

  // 복약 정보
  const [medicationInput, setMedicationInput] = useState('');
  const [medications, setMedications] = useState<string[]>([]);

  // 치료 정보
  const [diseaseInput, setDiseaseInput] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const addAllergyNone = () => {
    const noneText = i18n.language === 'ko' ? '없음' : 'None';
    if (!allergies.includes(noneText)) {
      setAllergies([noneText]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const addMedication = () => {
    if (medicationInput.trim() && !medications.includes(medicationInput.trim())) {
      setMedications([...medications, medicationInput.trim()]);
      setMedicationInput('');
    }
  };

  const addMedicationNone = () => {
    const noneText = i18n.language === 'ko' ? '없음' : 'None';
    if (!medications.includes(noneText)) {
      setMedications([noneText]);
      setMedicationInput('');
    }
  };

  const removeMedication = (medication: string) => {
    setMedications(medications.filter((m) => m !== medication));
  };

  const addDisease = () => {
    if (diseaseInput.trim() && !chronicDiseases.includes(diseaseInput.trim())) {
      setChronicDiseases([...chronicDiseases, diseaseInput.trim()]);
      setDiseaseInput('');
    }
  };

  const addDiseaseNone = () => {
    const noneText = i18n.language === 'ko' ? '없음' : 'None';
    if (!chronicDiseases.includes(noneText)) {
      setChronicDiseases([noneText]);
      setDiseaseInput('');
    }
  };

  const removeDisease = (disease: string) => {
    setChronicDiseases(chronicDiseases.filter((d) => d !== disease));
  };

  const handleSubmit = async () => {
    try {
      // 기존 데이터 가져오기
      const existingData: RegisterFormData = JSON.parse(localStorage.getItem('registerData') || '{}');

      // 최종 회원가입 데이터 (프론트엔드 형식)
      const finalData: RegisterFormData = {
        ...existingData,
        insurance: {
          hasNationalInsurance,
          globalInsurance: selectedGlobalInsurance,
          otherInsurance,
        },
        allergies,
        medications,
        chronicDiseases,
      };

      // API 형식으로 변환
      const apiData: RegisterData = {
        user_id: finalData.username || '',
        password: finalData.password || '',
        name: finalData.fullName || '',
        birth_date: finalData.birthDate || '',
        phone_number: finalData.phone || '',
        email: finalData.email || undefined,
        address: finalData.location || undefined,
        insurance_info: finalData.insurance?.hasNationalInsurance
          ? '국민건강보험'
          : (finalData.insurance?.globalInsurance || finalData.insurance?.otherInsurance || 'None'),
        allergies: finalData.allergies && finalData.allergies.length > 0
          ? finalData.allergies.join(', ')
          : 'None',
        medications: finalData.medications && finalData.medications.length > 0
          ? finalData.medications.join(', ')
          : 'None',
        medical_history: finalData.chronicDiseases && finalData.chronicDiseases.length > 0
          ? finalData.chronicDiseases.join(', ')
          : '없음',
      };

      console.log('📝 [Step 4] 회원가입 폼 데이터:', finalData);
      console.log('🔄 [Step 4] API 변환 데이터:', apiData);

      // API 호출
      const response = await authAPI.register(apiData);

      console.log('🎉 [Step 4] 회원가입 완료! 사용자:', response.user_name);

      // 성공 알림
      alert(t('register.registrationCompleteMessage'));

      // 로컬스토리지 클리어
      localStorage.removeItem('registerData');

      // 로그인 페이지로 이동
      router.push('/login');
    } catch (error: any) {
      console.error('회원가입 실패:', error);

      // 에러 메시지 표시
      const errorMessage = error.response?.data?.detail || t('common.error');
      alert(errorMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <LanguageSwitcher />

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>{t('register.step4Title')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-600">{t('register.progress', { current: 4 })}</span>
                <span className="text-gray-500">{t('register.medicalInfo')}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-full rounded-full bg-blue-600 transition-all" />
              </div>
            </div>
          </div>

          {/* Insurance Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">
              {t('register.insurance')} <span className="text-red-500">*</span>
            </h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="nationalInsurance"
                checked={hasNationalInsurance}
                onCheckedChange={(checked) => {
                  setHasNationalInsurance(checked as boolean);
                  if (checked) {
                    setSelectedGlobalInsurance('');
                    setOtherInsurance('');
                  }
                }}
              />
              <Label htmlFor="nationalInsurance" className="cursor-pointer">
                {t('register.insuranceNational')}
              </Label>
            </div>

            {/* 글로벌 건강 보험 선택 */}
            <div className="space-y-2">
              <Label>{i18n.language === 'ko' ? '글로벌 건강 보험 (선택)' : 'Global Health Insurance (Optional)'}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedGlobalInsurance}
                onChange={(e) => {
                  setSelectedGlobalInsurance(e.target.value);
                  if (e.target.value) {
                    setHasNationalInsurance(false);
                    setOtherInsurance('');
                  }
                }}
                disabled={hasNationalInsurance}
              >
                <option value="">{i18n.language === 'ko' ? '보험 선택...' : 'Select insurance...'}</option>
                {GLOBAL_INSURANCE_OPTIONS.map((insurance) => (
                  <option key={insurance} value={insurance}>
                    {insurance}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherInsurance">{t('register.insuranceOther')}</Label>
              <Input
                id="otherInsurance"
                type="text"
                placeholder={t('register.insuranceOtherPlaceholder')}
                value={otherInsurance}
                onChange={(e) => {
                  setOtherInsurance(e.target.value);
                  if (e.target.value) {
                    setHasNationalInsurance(false);
                    setSelectedGlobalInsurance('');
                  }
                }}
                disabled={hasNationalInsurance || !!selectedGlobalInsurance}
              />
            </div>
          </div>

          {/* Allergy Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">
              {t('register.allergies')} <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">{t('register.allergiesDesc')}</p>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t('register.allergiesPlaceholder')}
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                disabled={allergies.includes(i18n.language === 'ko' ? '없음' : 'None')}
              />
              <Button type="button" onClick={addAllergy} size="icon" disabled={allergies.includes(i18n.language === 'ko' ? '없음' : 'None')}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 없음 버튼 */}
            {allergies.length === 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAllergyNone}
                className="text-gray-500 hover:text-gray-700"
              >
                {i18n.language === 'ko' ? '알러지 없음' : 'No Allergies'}
              </Button>
            )}

            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="gap-1">
                    {allergy}
                    <button onClick={() => removeAllergy(allergy)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Medication Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">
              {t('register.medications')} <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">{t('register.medicationsDesc')}</p>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t('register.medicationsPlaceholder')}
                value={medicationInput}
                onChange={(e) => setMedicationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                disabled={medications.includes(i18n.language === 'ko' ? '없음' : 'None')}
              />
              <Button type="button" onClick={addMedication} size="icon" disabled={medications.includes(i18n.language === 'ko' ? '없음' : 'None')}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 없음 버튼 */}
            {medications.length === 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedicationNone}
                className="text-gray-500 hover:text-gray-700"
              >
                {i18n.language === 'ko' ? '복용 중인 약 없음' : 'No Medications'}
              </Button>
            )}

            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medications.map((medication) => (
                  <Badge key={medication} variant="secondary" className="gap-1">
                    {medication}
                    <button onClick={() => removeMedication(medication)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Chronic Disease Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">
              {t('register.diseases')} <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">{t('register.diseasesDesc')}</p>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t('register.diseasesPlaceholder')}
                value={diseaseInput}
                onChange={(e) => setDiseaseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDisease()}
                disabled={chronicDiseases.includes(i18n.language === 'ko' ? '없음' : 'None')}
              />
              <Button type="button" onClick={addDisease} size="icon" disabled={chronicDiseases.includes(i18n.language === 'ko' ? '없음' : 'None')}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 없음 버튼 */}
            {chronicDiseases.length === 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDiseaseNone}
                className="text-gray-500 hover:text-gray-700"
              >
                {i18n.language === 'ko' ? '기저질환 없음' : 'No Medical History'}
              </Button>
            )}

            {chronicDiseases.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chronicDiseases.map((disease) => (
                  <Badge key={disease} variant="secondary" className="gap-1">
                    {disease}
                    <button onClick={() => removeDisease(disease)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
            <p className="mb-1 font-medium">{t('register.medicalInfoTitle')}</p>
            <div className="whitespace-pre-line">{t('register.medicalInfoNote')}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleSubmit}
              disabled={
                (!hasNationalInsurance && !selectedGlobalInsurance && !otherInsurance) ||
                allergies.length === 0 ||
                medications.length === 0 ||
                chronicDiseases.length === 0
              }
            >
              {t('register.completeRegistration')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
