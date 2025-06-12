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
import { ResponseLogin } from './api/login.service';
import { CheckTokenService } from './api/check-token.service';
import { CartService } from './cart.service';
import { CustomerAddressService, ResponseAddress } from './api/customer-address.service';
import { InProgressSpinnerService } from './in-progress-spinner.service';
import { SocialAuthenticationService } from './api/social-login/social-authentication';
import { ToastService } from './toast.service';

import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInformation: BehaviorSubject<UserInformation | null> = new BehaviorSubject<UserInformation | null>(null);
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

  afterLogin(result: ResponseLogin){
    this.checkTokenValidation(result.accessToken);
    this.setDeliveryTo(result.accessToken);
    let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(result.accessToken);
    this.localStorageService.set(this.localStorageService.tokenStoragedKey, result);
    if(tokenInformation){
      this.setUserInformation(tokenInformation.data);
    }
  }

  updateAccessToken(newAccessToken: string){
    let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged){
      tokenStoraged.accessToken = newAccessToken;
      let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(tokenStoraged.accessToken);
      if(tokenInformation){
        this.localStorageService.set(this.localStorageService.tokenStoragedKey, tokenStoraged);
        this.setUserInformation(tokenInformation.data);
      }
    }
  }

  checkTokenValidation(accessToken: string){
    this.checkTokenService.getCheck(accessToken).subscribe(res=>{
      if(res){
        this.checkTokenService.set(true);
      }
    },err=>{
      this.checkTokenService.set(false);
      this.toastService.shortToastWarning('Phiên đăng nhập hết hạn', '');
      this.logout();
    })
  }

  setDeliveryTo(accessToken: string){
    this.customerAddressService.get(accessToken).subscribe(res=>{
      let responseAddress: ResponseAddress = res;
      let isHeadquartersAddress: Address | null = this.getIsHeadquartersAddress(responseAddress.address);
      this.cartService.setDelivery(isHeadquartersAddress);
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
    let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged){
      let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(tokenStoraged.accessToken);
      if(tokenInformation){
        this.setUserInformation(tokenInformation.data);
      }
    }
  }

  logout(){
    this.userInformation.next(null);
    this.cartService.setDelivery(null);
    this.localStorageService.remove(this.localStorageService.tokenStoragedKey);
    this.socialAuthenticationService.signOut();
    return this.router.navigate(['']);
  }

  setUserInformation(userInformation: UserInformation | null){
    this.userInformation.next(userInformation);
  }

  getUserInformation():Observable<UserInformation | null>{
    return this.userInformation.asObservable()
  }
}
