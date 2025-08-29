import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LangService } from '../../../services/lang.service';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const langService = inject(LangService);

  const lang = langService.getCurrentLang();
  
  const cloned = req.clone({
    setHeaders: {
      'Accept-Language': lang
    }
  });
  return next(cloned);
};