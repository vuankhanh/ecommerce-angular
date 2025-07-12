import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

//Component
import { MainComponent, TypeLogin } from '../sharing/modal/main/main.component';

//Model
import { IJwtDecoded } from '../models/token.interface';

//Service
import { JwtDecodedService } from './jwt-decoded.service';
import { LocalStorageService } from './local-storage.service';
import { SocialAuthenticationService } from './api/social-login/social-authentication';

import { BehaviorSubject, Observable } from 'rxjs';
import { TToken } from '../models/token.interface';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { AuthenticationUtil } from '../sharing/util/authentication.util';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly bJwtPayload: BehaviorSubject<IJwtDecoded | null> = new BehaviorSubject<IJwtDecoded | null>(null);
  public jwtPayload$: Observable<IJwtDecoded | null> = this.bJwtPayload.asObservable();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private jwtDecodedService: JwtDecodedService,
    private localStorageService: LocalStorageService,
    private socialAuthenticationService: SocialAuthenticationService
  ) {}

  login(type: 'login' | 'register' | 'forgotPassword') {
    if (type === 'login' || type === 'register' || type === 'forgotPassword') {
      let data: TypeLogin = { type: type };
      const dialogRef = this.dialog.open(MainComponent, {
        panelClass: 'login-modal',
        data: data,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.afterLogin(result);
        }
      })
    } else {
      console.log('Không đúng Modal Login')
    }
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

  getUserInfoFromTokenStoraged() {
    const accessTokenStoraged: string | null = this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
    if (accessTokenStoraged) {
      const tokenInformation: IJwtDecoded = <IJwtDecoded>this.jwtDecodedService.jwtDecoded(accessTokenStoraged);
      if (tokenInformation) {
        const isTokenValid: boolean = AuthenticationUtil.checkTokenExpires(tokenInformation);
        if (isTokenValid) this.userInformation = tokenInformation;
      }
    }
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
