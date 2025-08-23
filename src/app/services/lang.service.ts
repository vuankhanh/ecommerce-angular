import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getCurrentLang(): string {
    if (isPlatformBrowser(this.platformId)) {
      const base = document.querySelector('base');

      if (base && base.getAttribute('href')) {
        const href = base.getAttribute('href')!;
        const match = href.match(/^\/([a-zA-Z-]+)\//);
        return match ? match[1] : 'vi';
      }
    }
    return 'vi';
  }

  setLang(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      window.location.href = `/${lang}/${currentUrl.replace(/^\/[a-zA-Z-]+\//, '')}`;
    }
  }
}
