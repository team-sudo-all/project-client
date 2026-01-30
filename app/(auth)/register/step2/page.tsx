'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function RegisterStep2() {
  const router = useRouter();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 유효성 검사
  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isPasswordValid = isLengthValid && hasNumber && hasLetter;
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleNext = () => {
    if (isPasswordValid && isPasswordMatch) {
      // 기존 데이터 가져오기
      const existingData = JSON.parse(localStorage.getItem('registerData') || '{}');
      // 비밀번호 추가
      localStorage.setItem(
        'registerData',
        JSON.stringify({ ...existingData, password })
      );
      router.push('/register/step3');
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
          <CardDescription>{t('register.step2Title')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-600">{t('register.progress', { current: 2 })}</span>
                <span className="text-gray-500">{t('auth.password')}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-1/2 rounded-full bg-blue-600 transition-all" />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {t('auth.password')} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('register.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('auth.passwordConfirm')} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('register.passwordConfirmPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {isLengthValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span className={isLengthValid ? 'text-green-600' : 'text-gray-500'}>
                {t('register.passwordLength')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasLetter ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span className={hasLetter ? 'text-green-600' : 'text-gray-500'}>
                {t('register.passwordLetter')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasNumber ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span className={hasNumber ? 'text-green-600' : 'text-gray-500'}>
                {t('register.passwordNumber')}
              </span>
            </div>
          </div>

          {/* Password Match Alert */}
          {confirmPassword.length > 0 && (
            <Alert variant={isPasswordMatch ? 'default' : 'destructive'} className="flex items-center gap-2">
              {isPasswordMatch ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  <AlertDescription className="text-green-600">
                    {t('register.passwordMatch')}
                  </AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 shrink-0" />
                  <AlertDescription>{t('register.passwordMismatch')}</AlertDescription>
                </>
              )}
            </Alert>
          )}

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
              disabled={!isPasswordValid || !isPasswordMatch}
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
