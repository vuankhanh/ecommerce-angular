export enum Language {
  VI = 'vi',
  EN = 'en',
  JA = 'ja'
}

export function getLangs(): { code: `${Language}`; name: string, locale: string }[] {
  return [
    { code: 'vi', name: 'Tiếng Việt', locale: 'vi_VN' },
    { code: 'en', name: 'English', locale: 'en_US' },
    { code: 'ja', name: '日本語', locale: 'ja_JP' }
  ];
}