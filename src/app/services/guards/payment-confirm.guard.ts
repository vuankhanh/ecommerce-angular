import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Cart } from '../cart.service'

import { LocalStorageService } from '../local-storage.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentConfirmGuard implements CanActivate {
  constructor(
    private router: Router,
    private location: Location,
    private localStorageService: LocalStorageService,

    ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let cart: Cart = <Cart>this.localStorageService.get(this.localStorageService.  carotaCartKey = 'carota-cart');
    if(cart.deliverTo && cart.products.length){
      return true;
    }else{
      let hasHistory = this.router.navigated;
      if(hasHistory){
        this.location.back()
      }else{
        this.router.navigate(['']);
      }
      return false;
    }
  }
  
}
