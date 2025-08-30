import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { SSR_LANG } from '../sharing/constant/injection_token.constant';
import { Language } from '../sharing/constant/lang.constant';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly ssrLang: `${Language}` | null = inject(SSR_LANG, { optional: true });
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  readonly isBrowser: boolean = isPlatformBrowser(this.platformId);

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

  getCurrentLang(): `${Language}` {
    return (this.ssrLang ? this.ssrLang : this.localStorageService.get<`${Language}`>('lang')) || 'vi';
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
