import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private readonly isBrowser: boolean = isPlatformBrowser(this.platformId);
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly localStorageService: LocalStorageService
  ) { }

  getLangFromHref(): string | null {
    if (this.isBrowser) {
      const base = document.querySelector('base');

      if (base && base.getAttribute('href')) {
        const href = base.getAttribute('href')!;
        const match = href.match(/^\/([a-zA-Z-]+)\//);
        return match ? match[1] : null;
      }
    }
    return null;
  }

  getCurrentLang(): string {
    return this.localStorageService.get('lang') || 'vi';
  }

  setLang(lang: string): void {
    if (this.isBrowser) {
      this.localStorageService.set('lang', lang);
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      const newUrl = `/${lang}/${currentUrl.replace(/^\/[a-zA-Z-]+\//, '')}`;
      window.location.href = newUrl;
    }
  }
}
