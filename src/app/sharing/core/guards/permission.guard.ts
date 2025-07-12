import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

import { map } from 'rxjs/operators'

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.jwtPayload$.pipe(
    map(jwtPayload => {
      if(!!jwtPayload) return true;
      router.navigate(['/']);
      authService.login('login');
      return false;
    })
  )
};