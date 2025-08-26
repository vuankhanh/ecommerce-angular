import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LangService } from '../../../services/lang.service';
import { SSR_LANG } from '../../constant/injection_token.constant';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const langService = inject(LangService);
  const ssrLang = inject(SSR_LANG, { optional: true });

  const lang = ssrLang || langService.getCurrentLang();
  
  const cloned = req.clone({
    setHeaders: {
      'Accept-Language': lang
    }
  });
  return next(cloned);
};