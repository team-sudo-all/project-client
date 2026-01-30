'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Heart, Globe, Shield } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인 후 대시보드로 리다이렉트
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  }, [router]);

  // 로그인된 사용자는 대시보드로 리다이렉트되므로 로딩 표시
  if (isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LanguageSwitcher />

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Heart className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            {t('home.title')}
          </h1>
          <p className="mb-4 text-xl text-gray-600 sm:text-2xl">
            {t('home.subtitle')}
          </p>

          {/* Slogan - 영어 고정 */}
          <p className="mx-auto mb-8 max-w-xl text-lg italic text-gray-500">
            &quot;So you don&apos;t stop, even in unfamiliar pain&quot;
          </p>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
            {t('home.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/register/step1">{t('auth.register')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/login">{t('auth.login')}</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('home.feature1Title')}</h3>
              <p className="text-sm text-gray-600">
                {t('home.feature1Desc')}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('home.feature2Title')}</h3>
              <p className="text-sm text-gray-600">
                {t('home.feature2Desc')}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('home.feature3Title')}</h3>
              <p className="text-sm text-gray-600">
                {t('home.feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
