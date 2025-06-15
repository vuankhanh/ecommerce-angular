import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Event, NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { ProductCategory } from '../models/ProductCategory';
import { UserInformation } from '../models/UserInformation';

//Mock Data
import { CustomerMenu, Menu, MenusList } from '../mock-data/menu';

import { AppServicesService } from '../services/app-services.service';
import { AuthService } from '../services/auth.service';
import { CheckTokenService } from '../services/api/check-token.service';
import { Cart, CartService } from '../services/cart.service';
import { UrlChangeService } from '../services/url-change.service';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../sharing/module/material';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,

    MaterialModule
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  @ViewChild('accordion') accordion?: MatAccordion;
  @ViewChild('userAccordion') userAccordion?: MatAccordion;
  @Output() toggleDrawer = new EventEmitter();
  menusList: Array<Menu>;
  customerMenu: Array<Menu>;
  productCategorys: Array<ProductCategory> = [];
  badgeCart: number = 0;
  currentUrl: string = this.router.url;

  isLogin$ = this.checkTokenService.check$;
  userInformation$ = this.authService.jwtPayload$;

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private urlChangeService: UrlChangeService,
    private appServicesService: AppServicesService,
    private authService: AuthService,
    private checkTokenService: CheckTokenService,
    private cartService: CartService
  ) {
    this.menusList = MenusList;
    this.customerMenu = CustomerMenu;
    this.appServicesService.productCategory$.subscribe(res=>{
      this.productCategorys = res;
      for(let i in this.menusList){
        if(this.menusList[i].route === 'san-pham'){
          this.menusList[i].child = this.productCategorys;
        }
      }
    })
  }

  ngOnInit(): void {
    this.cartService.listenCartChange().subscribe((cart: Cart)=>{
      let badgeCart = this.cartService.sumQuantityOfCart(cart.products);
      this.badgeCart = badgeCart;
    });

    this.subscription.add(
      this.urlChangeService.urlChange().subscribe((event)=>{
        if(event) {
          this.currentUrl = event.url;
        }
      })
    );
  }

  navigationMenuItem(length: number, url: string){
    if(length === 0){
      this.closeSideMenu();
      this.router.navigate([url]);
    }
  }

  closeSideMenu(){
    this.accordion?.closeAll();
    this.userAccordion?.closeAll();
    this.toggleDrawer.emit();
  }

  login(type: 'login' | 'register'){
    this.authService.login(type);
    this.closeSideMenu();
  }

  logout(){
    this.closeSideMenu();
    this.authService.logout();
  }

}
