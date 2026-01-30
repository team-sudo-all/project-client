'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X, Building2, ClipboardList, Stethoscope, Wallet, Lightbulb, Globe } from 'lucide-react';
import Link from 'next/link';

type GuideSection = 'hospitalTypes' | 'beforeVisit' | 'duringVisit' | 'medicalCosts' | 'otherTips' | null;

export default function HospitalGuidePage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState<GuideSection>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const sections = [
    { id: 'hospitalTypes' as const, icon: Building2 },
    { id: 'beforeVisit' as const, icon: ClipboardList },
    { id: 'duringVisit' as const, icon: Stethoscope },
    { id: 'medicalCosts' as const, icon: Wallet },
    { id: 'otherTips' as const, icon: Lightbulb },
  ];

  const renderModalContent = () => {
    switch (activeSection) {
      case 'hospitalTypes':
        return <HospitalTypesContent t={t} />;
      case 'beforeVisit':
        return <BeforeVisitContent t={t} />;
      case 'duringVisit':
        return <DuringVisitContent t={t} />;
      case 'medicalCosts':
        return <MedicalCostsContent t={t} />;
      case 'otherTips':
        return <OtherTipsContent t={t} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-blue-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
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
      <main className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            {t('guide.title')}
          </h1>

          {/* Section Buttons */}
          <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="flex w-full items-center gap-4 rounded-xl border-2 border-blue-200 bg-blue-50 px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-800">
                  {t(`guide.sections.${section.id}`)}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </main>

      {/* Modal */}
      {activeSection && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActiveSection(null)}
        >
          <div 
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-blue-50 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                {t(`guide.sections.${activeSection}`)}
              </h2>
              <button
                onClick={() => setActiveSection(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition hover:bg-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-5 py-4">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hospital Types Content
function HospitalTypesContent({ t }: { t: any }) {
  const levels = ['level1', 'level2', 'level3'] as const;
  
  return (
    <div className="space-y-6">
      {levels.map((level) => (
        <div key={level}>
          <h3 className="mb-2 font-bold text-blue-700">
            {t(`guide.hospitalTypes.${level}.title`)}
          </h3>
          <ul className="space-y-1.5 text-sm text-gray-700">
            {(t(`guide.hospitalTypes.${level}.items`, { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Before Visit Content
function BeforeVisitContent({ t }: { t: any }) {
  return (
    <div className="space-y-6">
      {/* Appointment Section */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">
          {t('guide.beforeVisit.appointment.title')}
        </h3>
        
        <div className="mb-4">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
            <span>▶</span>
            {t('guide.beforeVisit.appointment.walkIn.title')}
          </h4>
          <ul className="ml-4 space-y-1 text-sm text-gray-700">
            {(t('guide.beforeVisit.appointment.walkIn.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
            <span>▶</span>
            {t('guide.beforeVisit.appointment.reservation.title')}
          </h4>
          <ul className="ml-4 space-y-1 text-sm text-gray-700">
            {(t('guide.beforeVisit.appointment.reservation.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preparation Section */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">
          {t('guide.beforeVisit.preparation.title')}
        </h3>
        
        <div className="mb-4">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
            <span>▶</span>
            {t('guide.beforeVisit.preparation.essential.title')}
          </h4>
          <ul className="ml-4 space-y-1 text-sm text-gray-700">
            {(t('guide.beforeVisit.preparation.essential.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
            <span>▶</span>
            {t('guide.beforeVisit.preparation.additional.title')}
          </h4>
          <ul className="ml-4 space-y-1 text-sm text-gray-700">
            {(t('guide.beforeVisit.preparation.additional.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// During Visit Content
function DuringVisitContent({ t }: { t: any }) {
  return (
    <div className="space-y-6">
      {/* Steps Section */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">
          {t('guide.duringVisit.steps.title')}
        </h3>
        <ol className="space-y-2 text-sm text-gray-700">
          {(t('guide.duringVisit.steps.items', { returnObjects: true }) as string[]).map((item, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                {idx + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Culture Section */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">
          {t('guide.duringVisit.culture.title')}
        </h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {(t('guide.duringVisit.culture.items', { returnObjects: true }) as string[]).map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-blue-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Medical Costs Content
function MedicalCostsContent({ t }: { t: any }) {
  return (
    <div className="space-y-6">
      {/* Surcharge Section */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">
          {t('guide.medicalCosts.surcharge.title')}
        </h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {(t('guide.medicalCosts.surcharge.items', { returnObjects: true }) as string[]).map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-blue-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Insurance Section */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">
          {t('guide.medicalCosts.insurance.title')}
        </h3>
        
        {/* National */}
        <div className="mb-4 rounded-lg bg-green-50 p-3">
          <h4 className="mb-2 font-semibold text-green-700">
            [{t('guide.medicalCosts.insurance.national.title')}]
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(t('guide.medicalCosts.insurance.national.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Non-National */}
        <div className="mb-4 rounded-lg bg-orange-50 p-3">
          <h4 className="mb-2 font-semibold text-orange-700">
            [{t('guide.medicalCosts.insurance.nonNational.title')}]
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(t('guide.medicalCosts.insurance.nonNational.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-orange-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Private */}
        <div className="mb-4 rounded-lg bg-purple-50 p-3">
          <h4 className="mb-2 font-semibold text-purple-700">
            [{t('guide.medicalCosts.insurance.private.title')}]
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {(t('guide.medicalCosts.insurance.private.items', { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-500 italic">
          {t('guide.medicalCosts.insurance.note')}
        </p>
      </div>
    </div>
  );
}

// Other Tips Content
function OtherTipsContent({ t }: { t: any }) {
  return (
    <div>
      <ul className="space-y-3 text-sm text-gray-700">
        {(t('guide.otherTips.items', { returnObjects: true }) as string[]).map((item, idx) => (
          <li key={idx} className="flex gap-3 rounded-lg bg-yellow-50 p-3">
            <span className="text-lg">💡</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
