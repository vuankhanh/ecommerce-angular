export function getLangs(): { code: string; name: string, locale: string }[] {
  return [
    { code: 'vi', name: 'Tiếng Việt', locale: 'vi_VN' },
    { code: 'en', name: 'English', locale: 'en_US' },
    { code: 'ja', name: '日本語', locale: 'ja_JP' }
  ];
}