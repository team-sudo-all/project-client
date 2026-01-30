'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { authAPI } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    // 폼 제출 이벤트가 있으면 기본 동작 방지
    if (e) {
      e.preventDefault();
    }

    try {
      if (!username || !password) {
        alert(t('auth.loginRequired'));
        return;
      }

      console.log('🔐 [로그인 페이지] 로그인 시도 - 아이디:', username);

      const response = await authAPI.login({
        user_id: username,
        password: password,
      });

      console.log('🎉 [로그인 페이지] 로그인 완료! 사용자:', response.user_name);

      // 로그인 성공 시 사용자 정보 저장 (localStorage에 간단히 저장)
      localStorage.setItem('user', JSON.stringify({
        user_id: response.user_id,
        user_name: response.user_name,
      }));

      // 대시보드로 이동
      alert(`${response.user_name}${t('auth.loginSuccess')}`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('로그인 실패:', error);

      // 에러 메시지 표시
      const errorMessage = error.response?.data?.detail || t('common.error');
      alert(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LanguageSwitcher />

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>
            {t('auth.loginDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">{t('auth.username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('auth.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password')}
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

            {/* Login Button */}
            <Button type="submit" className="w-full">
              {t('auth.login')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">{t('auth.orDivider')}</span>
            </div>
          </div>

          {/* Register Link */}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/register/step1">{t('auth.register')}</Link>
          </Button>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              {t('auth.backToHome')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
