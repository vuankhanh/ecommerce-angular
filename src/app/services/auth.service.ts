import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

//Component

//Model
import { IJwtDecoded } from '../models/token.interface';

//Service
import { JwtDecodedService } from './jwt-decoded.service';
import { LocalStorageService } from './local-storage.service';
import { SocialAuthenticationService } from './api/social-login/social-authentication';

import { BehaviorSubject, filter, lastValueFrom, Observable, switchMap, take } from 'rxjs';
import { TToken } from '../models/token.interface';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { AuthenticationUtil } from '../sharing/util/authentication.util';
import { LocalAuthenticationService } from './api/local-authentication.service';
import { DeliveryService } from './delivery.service';
import { AuthComponent, TypeLogin } from '../sharing/modal/auth/auth.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BreakpointDetectionService } from './breakpoint-detection.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isMobile$: Observable<boolean> = this.breakpointDetectionService.detection$();
  private readonly bJwtPayload: BehaviorSubject<IJwtDecoded | null> = new BehaviorSubject<IJwtDecoded | null>(null);
  public jwtPayload$: Observable<IJwtDecoded | null> = this.bJwtPayload.asObservable();
  constructor(
    private router: Router,
    private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private readonly breakpointDetectionService: BreakpointDetectionService,
    private jwtDecodedService: JwtDecodedService,
    private localStorageService: LocalStorageService,
    private socialAuthenticationService: SocialAuthenticationService,
    private localAuthenticationService: LocalAuthenticationService,
    private deliveryService: DeliveryService,
  ) { }

  login(type: 'login' | 'register' | 'forgotPassword') {
    let data: TypeLogin = { type: type };
    this.openAuthenticationComponent(data).pipe(
      filter(result => !!result),
      take(1)
    ).subscribe(result => {
      this.afterLogin(result);
    });
  }

  private openAuthenticationComponent(data: TypeLogin) {
    return this.isMobile$.pipe(
      take(1),
      switchMap(isMobile => {
        if (isMobile) return this._bottomSheet.open(AuthComponent, {
          panelClass: 'login-modal',
          data: data
        }).afterDismissed();

        return this._dialog.open(AuthComponent, {
          panelClass: 'login-modal',
          data: data
        }).afterClosed()
      })
    )
  }

  afterLogin(token: TToken) {
    this.updateAccessToken(token.accessToken);
    this.localStorageService.set(LocalStorageKey.REFRESHTOKEN, token.refreshToken);
  }

  updateAccessToken(newAccessToken: string) {
    const tokenInformation: IJwtDecoded = <IJwtDecoded>this.jwtDecodedService.jwtDecoded(newAccessToken);
    if (!tokenInformation) {
      console.error('Invalid access token');
      return;
    }
    this.localStorageService.set(LocalStorageKey.ACCESSTOKEN, newAccessToken);
    this.userInformation = tokenInformation;
  }

  async getUserInfoFromTokenStoraged(): Promise<boolean> {
    const accessTokenStoraged: string | null = this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
    if (accessTokenStoraged) {
      const tokenInformation: IJwtDecoded = <IJwtDecoded>this.jwtDecodedService.jwtDecoded(accessTokenStoraged);
      if (tokenInformation) {
        // const isTokenExpire: boolean = AuthenticationUtil.checkTokenExpires(tokenInformation);
        try {
          const response = await lastValueFrom(this.localAuthenticationService.config());
          this.userInformation = tokenInformation;
          return true;
        } catch (error) {
          console.error('Error fetching user info:', error);
          return false
        }
      }
    }

    return false;
  }

  logout() {
    this.bJwtPayload.next(null);
    // this.cartService.setDelivery(null);
    this.localStorageService.remove(LocalStorageKey.ACCESSTOKEN);
    this.localStorageService.remove(LocalStorageKey.REFRESHTOKEN);
    this.socialAuthenticationService.signOut();
    return this.router.navigate(['']);
  }

  private set userInformation(jwtPayload: IJwtDecoded) {
    this.bJwtPayload.next(jwtPayload);
  }
}
