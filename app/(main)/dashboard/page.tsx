'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Pill, Stethoscope, User, LogOut, Globe, BookOpen } from 'lucide-react';

interface UserInfo {
  user_id: string;
  user_name: string;
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          {/* Left - My Page */}
          <Link
            href="/mypage"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <User className="h-4 w-4" />
            {t('main.mypage')}
          </Link>

          {/* Right - Logout & Language */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              {t('auth.logout')}
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <Globe className="h-4 w-4" />
              {i18n.language === 'ko' ? 'EN' : '한국어'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Slogan */}
        <p className="mb-6 text-center text-xl font-medium text-gray-600">
          So you don&apos;t stop, even in unfamiliar pain
        </p>

        {/* Logo */}
        <h1 className="mb-2 text-7xl font-bold text-gray-900 lg:text-8xl">
          Na-um
        </h1>

        {/* Tagline */}
        <p className="mb-16 text-lg text-gray-500">
          {t('main.tagline')}
        </p>

        {/* Feature Buttons */}
        <div className="flex w-full max-w-md flex-col gap-4">
          <FeatureButton
            href="/medicine"
            icon={<Pill className="h-6 w-6" />}
            title={t('main.searchMedications')}
            description={t('main.searchMedicationsDesc')}
            color="green"
          />
          <FeatureButton
            href="/symptoms"
            icon={<Stethoscope className="h-6 w-6" />}
            title={t('main.describeSymptoms')}
            description={t('main.describeSymptomsDesc')}
            color="purple"
          />
          <FeatureButton
            href="/guide"
            icon={<BookOpen className="h-6 w-6" />}
            title={t('main.hospitalGuide')}
            description={t('main.hospitalGuideDesc')}
            color="blue"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        {t('home.footer')}
      </footer>
    </div>
  );
}

// Feature Button Component
interface FeatureButtonProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'green' | 'purple' | 'blue';
}

function FeatureButton({ href, icon, title, description, color }: FeatureButtonProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  };

  return (
    <Link href={href} className="group">
      <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-gray-400 transition-transform group-hover:translate-x-1">
          →
        </div>
      </div>
    </Link>
  );
}
