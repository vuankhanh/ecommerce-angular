import { inject, Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';

import { SupportService } from '../../../services/api/support.service';

import { Observable, of } from 'rxjs';
import { SupportDetail } from '../../../models/Support';

export const supportResolver: ResolveFn<SupportDetail> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<SupportDetail> => {
  const supportService = inject(SupportService);
  const supportRoute = route.paramMap.get('route') || '';
  console.log(supportRoute);
  
  return supportService.getDetail(supportRoute);
};
