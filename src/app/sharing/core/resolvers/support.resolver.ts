import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';

import { SupportService } from '../../../services/api/support.service';

import { Observable } from 'rxjs';
import { SupportDetail } from '../../../models/Support';

export const supportResolver: ResolveFn<SupportDetail> = (
  route: ActivatedRouteSnapshot
): Observable<SupportDetail> => {
  const supportService = inject(SupportService);
  const supportRoute = route.paramMap.get('route') ?? '';

  return supportService.getDetail(supportRoute);
};
