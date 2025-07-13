import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageKey } from '../../constant/local_storage.constant';
import { LocalAuthenticationService } from '../../../services/api/local-authentication.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const localAuthenticationService = inject(LocalAuthenticationService);
  const localStorageService = inject(LocalStorageService);
  if (request.url.includes('/api/client') || request.url.includes('/api/auth/config')) {
    const accessToken = localStorageService.get(LocalStorageKey.ACCESSTOKEN);
    
    if (accessToken) {
      const cloned = request.clone({
        headers: request.headers.set("authorization", "Bearer " + accessToken)
      });
      return next(cloned).pipe(
        catchError(error => {
          console.log('Error in auth interceptor:', error);
          
          if (error instanceof HttpErrorResponse && !request.url.includes('/login') && error.status === 401) {
            return handle401Error(request, next, authService, localAuthenticationService, localStorageService);
          }
          return throwError(() => error);
        })
      );
    }
  }
  return next(request);
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  localAuthenticationService: LocalAuthenticationService,
  localStorageService: LocalStorageService
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;

    const refreshToken: string | null = localStorageService.get(LocalStorageKey.REFRESHTOKEN);
    if (!refreshToken) {
      authService.logout();
      isRefreshing = false;
      return throwError(() => new Error('No refresh token available'));
    }

    const refreshTokenRequest = localAuthenticationService.refreshToken(refreshToken);
    return refreshTokenRequest.pipe(
      switchMap(accessToken => {
        localStorageService.set(LocalStorageKey.ACCESSTOKEN, accessToken);
        isRefreshing = false;
        const cloned = request.clone({
          headers: request.headers.set("authorization", "Bearer " + accessToken)
        });
        return next(cloned);
      }),
      catchError((error) => {
        isRefreshing = false;
        if (error.status == '403') {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  return next(request);
}