import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Menu, MenusList } from '../mock-data/menu';

import { Identification } from '../models/Identification';
import { ProductCategory } from '../models/ProductCategory';

import { ConfigService } from '../services/api/config.service';
import { AppServicesService } from '../services/app-services.service';
import { Cart, CartService } from '../services/cart.service';
import { HeaderService } from '../services/header.service';
import { SupportService } from '../services/api/support.service';

import { Subscription } from 'rxjs';
import { Support } from '../models/Support';
import { MaterialModule } from '../sharing/module/material';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,

    RouterLink,
    RouterLinkActive,

    MaterialModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Output() toggleDrawer = new EventEmitter();
  identification?: Identification;

  badgeCart: number = 0;
  menusList: Array<Menu>;
  
  supports: Array<Support> = [];

  productCategorys: Array<ProductCategory> = [];

  isBrowser: boolean;

  subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private configService: ConfigService,
    private headerService: HeaderService,
    private cartService: CartService,
    private appServicesService: AppServicesService,
    private supportService: SupportService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.menusList = MenusList;
    this.appServicesService.productCategory$.subscribe(res=>{
      this.productCategorys = res;
      for(let i in this.menusList){
        if(this.menusList[i].route === 'san-pham'){
          this.menusList[i].child = this.productCategorys
        }
      }
    });
  }

  ngOnInit(): void {
    this.cartService.listenCartChange().subscribe((cart: Cart)=>{
      let badgeCart = this.cartService.sumQuantityOfCart(cart.products);
      this.badgeCart = badgeCart;
    });

    this.listenConfig();
    this.listenSupport();
  }

  
  listenConfig(){
    this.subscription.add(
      this.configService.getConfig().subscribe({
        next: (config)=> this.configService.set(config),
        error: (err) => console.error('Lỗi lấy cấu hình:', err.message),
        complete: () => console.log('Cấu hình đã được lấy thành công')
      })
    )
  }

  listenSupport(){
    this.subscription.add(
      this.supportService.getAll().subscribe({
        next: (supports) => {
          this.supports = supports
        },
        error: (err) => console.log('Lỗi lấy hỗ trợ:', err.message),
        complete: () => console.log('Hỗ trợ đã được lấy thành công')
      })
    )
  }

  closeAlertAddedToCart(){
    this.headerService.set(false);
  }

  toggleDrawerEmit(){
    this.toggleDrawer.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
