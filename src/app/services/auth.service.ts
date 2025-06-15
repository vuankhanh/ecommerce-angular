import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

//Component
import { MainComponent, TypeLogin } from '../sharing/modal/main/main.component';

//Model
import { UserInformation, JwtDecoded } from '../models/UserInformation';
import { Address } from '../models/Address';

//Service
import { JwtDecodedService } from './jwt-decoded.service';
import { LocalStorageService } from './local-storage.service';
import { CheckTokenService } from './api/check-token.service';
import { CartService } from './cart.service';
import { CustomerAddressService, ResponseAddress } from './api/customer-address.service';
import { InProgressSpinnerService } from './in-progress-spinner.service';
import { SocialAuthenticationService } from './api/social-login/social-authentication';
import { ToastService } from './toast.service';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { TToken } from '../models/token.interface';
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
    private checkTokenService: CheckTokenService,
    private cartService: CartService,
    private customerAddressService: CustomerAddressService,
    private inProgressSpinnerService: InProgressSpinnerService,
    private socialAuthenticationService: SocialAuthenticationService,
    private toastService: ToastService
  ) {
    this.getUserInfoFromTokenStoraged();
  }

  login(type: 'login' | 'register' | 'forgotPassword'){
    if(type === 'login' || type === 'register' || type === 'forgotPassword'){
      let data: TypeLogin = { type: type };
      const dialogRef = this.dialog.open(MainComponent,{
        panelClass: 'login-modal',
        data: data,
      });
  
      dialogRef.afterClosed().subscribe(result=>{
        if(result){
          this.afterLogin(result);
        }
      })
    }else{
      console.log('Không đúng Modal Login')
    }
  }

  afterLogin(token: TToken){
    this.checkTokenValidation(token.accessToken);
    this.setDeliveryTo(token.accessToken);
    let jwtPayload: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(token.accessToken);
    this.localStorageService.set(this.localStorageService.tokenStoragedKey, token);
    if(jwtPayload){
      console.log('Token Information:', jwtPayload);
      
      this.setUserInformation(jwtPayload);
    }
  }

  updateAccessToken(newAccessToken: string){
    let tokenStoraged: TToken = <TToken>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged){
      tokenStoraged.accessToken = newAccessToken;
      let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(tokenStoraged.accessToken);
      if(tokenInformation){
        this.localStorageService.set(this.localStorageService.tokenStoragedKey, tokenStoraged);
        this.setUserInformation(tokenInformation);
      }
    }
  }

  checkTokenValidation(accessToken: string){
    this.checkTokenService.getCheck(accessToken).subscribe({
      next: res => {
        console.log(res);
        
        this.checkTokenService.set(true);
      },
      error: (err: Error) => {
        console.error('Error checking token:', err);
        this.checkTokenService.set(false);
        this.toastService.shortToastError('Phiên đăng nhập hết hạn', 'Lỗi');
        this.logout();
      }
    })
  }

  setDeliveryTo(accessToken: string){
    this.customerAddressService.get(accessToken).subscribe({
      next: (res: ResponseAddress) => {
        let isHeadquartersAddress: Address | null = this.getIsHeadquartersAddress(res.address);
        this.cartService.setDelivery(isHeadquartersAddress);
      },
      error: (err: Error) => {
        console.log('Error fetching addresses:', err);
        this.inProgressSpinnerService.progressSpinnerStatus(false);
        this.toastService.shortToastError('Không thể lấy địa chỉ giao hàng', 'Lỗi');
      }
    })
  }

  getIsHeadquartersAddress(addresses: Array<Address>): Address | null {
    if(!addresses || addresses.length===0){
      return null;
    }else{
      let index = addresses.findIndex(address=> address.isHeadquarters);
      let address: Address = index >= 0 ? addresses[index] : addresses[0];
      return address;
    }
  }

  getUserInfoFromTokenStoraged(){
    let tokenStoraged: TToken = <TToken>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged){
      let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(tokenStoraged.accessToken);
      if(tokenInformation){
        this.setUserInformation(tokenInformation);
      }
    }
  }

  logout(){
    this.bJwtPayload.next(null);
    this.cartService.setDelivery(null);
    this.localStorageService.remove(this.localStorageService.tokenStoragedKey);
    this.socialAuthenticationService.signOut();
    return this.router.navigate(['']);
  }

  setUserInformation(jwtPayload: JwtDecoded){
    console.log('Setting user information:', jwtPayload);
    this.bJwtPayload.next(jwtPayload);
  }

}
