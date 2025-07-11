import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { LocalStorageKey } from '../../sharing/constant/local_storage.constant';
import { LoginService } from './login.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const loginService = inject(LoginService);
  const localStorageService = inject(LocalStorageService);

  if (!request.url.includes('/login')) {
    const accessToken = localStorageService.get(LocalStorageKey.ACCESSTOKEN);

    if (accessToken) {
      const cloned = request.clone({
        headers: request.headers.set("authorization", "Bearer " + accessToken)
      });
      return next(cloned).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && !request.url.includes('/login') && error.status === 401) {
            return handle401Error(request, next, authService, loginService, localStorageService);
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
  loginService: LoginService,
  localStorageService: LocalStorageService
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;

    const refreshToken = localStorageService.get(LocalStorageKey.REFRESHTOKEN);
    const refreshTokenRequest = loginService.refreshToken(refreshToken!);
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