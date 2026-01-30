'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function RegisterStep3() {
  const router = useRouter();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    phone: '',
    email: '',
    location: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.fullName.trim().length >= 2 &&
    formData.birthDate.trim().length > 0 &&
    formData.phone.trim().length >= 10;

  const handleNext = () => {
    if (isFormValid) {
      // 기존 데이터 가져오기
      const existingData = JSON.parse(localStorage.getItem('registerData') || '{}');
      // 개인정보 추가
      localStorage.setItem(
        'registerData',
        JSON.stringify({ ...existingData, ...formData })
      );
      router.push('/register/step4');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <LanguageSwitcher />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>{t('register.step3Title')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-600">{t('register.progress', { current: 3 })}</span>
                <span className="text-gray-500">{t('register.personalInfo')}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-3/4 rounded-full bg-blue-600 transition-all" />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              {t('auth.fullName')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder={t('register.fullNamePlaceholder')}
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">
              {t('auth.birthDate')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('auth.phone')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t('register.phonePlaceholder')}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t('auth.email')} ({t('common.optional')})
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('register.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          {/* Location (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="location">
              {t('auth.location')} ({t('common.optional')})
            </Label>
            <Input
              id="location"
              type="text"
              placeholder={t('register.locationPlaceholder')}
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
            <p className="mb-1 font-medium">{t('register.requiredFields')}</p>
            <div className="whitespace-pre-line">{t('register.personalInfoDesc')}</div>
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
              onClick={handleNext}
              disabled={!isFormValid}
            >
              {t('common.next')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
