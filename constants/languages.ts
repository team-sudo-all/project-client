export const SUPPORTED_LANGUAGES = [
  {
    code: 'ko',
    name: '한국어',
    nameEn: 'Korean',
    flag: '🇰🇷',
  },
  {
    code: 'en',
    name: 'English',
    nameEn: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'zh',
    name: '中文',
    nameEn: 'Chinese',
    flag: '🇨🇳',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    nameEn: 'Vietnamese',
    flag: '🇻🇳',
  },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
