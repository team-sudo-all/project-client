'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { authAPI } from '@/lib/api/auth';

export default function RegisterStep1() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleCheckUsername = async () => {
    if (username.length < 4) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    console.log('🔍 [Step 1] 아이디 중복 확인 - 아이디:', username);

    try {
      // 전체 사용자 목록 조회
      const users = await authAPI.getUsers();

      // 입력한 아이디가 이미 존재하는지 확인
      const available = !users[username];

      setIsAvailable(available);
      console.log(available ? '✅ [Step 1] 사용 가능한 아이디' : '❌ [Step 1] 중복된 아이디');
      console.log('📋 [Step 1] 현재 등록된 사용자 목록:', Object.keys(users));
    } catch (error) {
      console.error('❌ [Step 1] 중복 확인 실패:', error);
      // API 호출 실패 시 에러 상태로 처리
      setIsAvailable(null);
      alert(t('register.checkError') || '서버 연결에 실패했습니다. 다시 시도해주세요.');
    }

    setIsChecking(false);
  };

  const handleNext = () => {
    if (isAvailable) {
      localStorage.setItem('registerData', JSON.stringify({ username }));
      router.push('/register/step2');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <LanguageSwitcher />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>{t('register.step1Title')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-600">{t('register.progress', { current: 1 })}</span>
                <span className="text-gray-500">{t('auth.username')}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-1/4 rounded-full bg-blue-600 transition-all" />
              </div>
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username">
              {t('auth.username')} <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="username"
                type="text"
                placeholder={t('register.usernamePlaceholder')}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsAvailable(null);
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckUsername}
                disabled={username.length < 4 || isChecking}
              >
                {isChecking ? t('register.checking') : t('register.checkDuplicate')}
              </Button>
            </div>
          </div>

          {/* Validation Message */}
          {isAvailable !== null && (
            <Alert variant={isAvailable ? 'default' : 'destructive'} className="flex items-center gap-2">
              {isAvailable ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  <AlertDescription className="text-green-600">
                    {t('register.usernameAvailable')}
                  </AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 shrink-0" />
                  <AlertDescription>{t('register.usernameUnavailable')}</AlertDescription>
                </>
              )}
            </Alert>
          )}

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700 whitespace-pre-line">
            {t('register.usernameInfo')}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/')}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleNext}
              disabled={!isAvailable}
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
