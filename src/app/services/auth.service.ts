import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

//Component
import { MainComponent, TypeLogin } from '../sharing/modal/main/main.component';

//Model
import { UserInformation, JwtDecoded } from '../models/UserInformation';

//Service
import { JwtDecodedService } from './jwt-decoded.service';
import { LocalStorageService } from './local-storage.service';
import { CartService } from './cart.service';
import { InProgressSpinnerService } from './in-progress-spinner.service';
import { SocialAuthenticationService } from './api/social-login/social-authentication';
import { ToastService } from './toast.service';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { TToken } from '../models/token.interface';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { AuthenticationUtil } from '../sharing/util/authentication.util';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly bJwtPayload: BehaviorSubject<JwtDecoded | null> = new BehaviorSubject<JwtDecoded | null>(null);
  public readonly jwtPayload$: Observable<JwtDecoded | null> = this.bJwtPayload.asObservable();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private jwtDecodedService: JwtDecodedService,
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private inProgressSpinnerService: InProgressSpinnerService,
    private socialAuthenticationService: SocialAuthenticationService,
    private toastService: ToastService
  ) {
    this.getUserInfoFromTokenStoraged();
    console.log('AuthService initialized');

  }

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
    this.localStorageService.set(LocalStorageKey.REFRESHTOKEN, JSON.stringify(token.refreshToken));
  }

  updateAccessToken(newAccessToken: string) {
    let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(newAccessToken);
    if (!tokenInformation) {
      console.error('Invalid access token');
      return;
    }
    this.localStorageService.set(LocalStorageKey.ACCESSTOKEN, JSON.stringify(newAccessToken));
    this.setUserInformation(tokenInformation);
  }

  // setDeliveryTo(accessToken: string){
  //   this.customerAddressService.get(accessToken).subscribe({
  //     next: (res: ResponseAddress) => {
  //       let isHeadquartersAddress: Address | null = this.getIsHeadquartersAddress(res.address);
  //       this.cartService.setDelivery(isHeadquartersAddress);
  //     },
  //     error: (err: Error) => {
  //       console.log('Error fetching addresses:', err);
  //       this.inProgressSpinnerService.progressSpinnerStatus(false);
  //       this.toastService.shortToastError('Không thể lấy địa chỉ giao hàng', 'Lỗi');
  //     }
  //   })
  // }

  getUserInfoFromTokenStoraged() {
    let accessTokenStoraged: string = this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
    if (accessTokenStoraged) {
      let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(accessTokenStoraged);
      if (tokenInformation) {
        const isTokenValid: boolean = AuthenticationUtil.checkTokenExpires(tokenInformation);
        if (isTokenValid) this.setUserInformation(tokenInformation);
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

  setUserInformation(jwtPayload: JwtDecoded) {
    this.bJwtPayload.next(jwtPayload);
  }
}
