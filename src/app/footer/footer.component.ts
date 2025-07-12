import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Identification } from '../models/Identification';

import { ConfigService } from '../services/api/config.service';
import { CartService } from '../services/cart.service';
import { SupportService } from '../services/api/support.service';

import { Subscription } from 'rxjs';
import { Support } from '../models/Support';
import { MaterialModule } from '../sharing/module/material';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TMenu } from '../models/menu.interface';
import { Menu } from '../sharing/constant/menu.constant';
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
  menusList: Array<TMenu> = Menu;

  supports: Array<Support> = [];

  isBrowser: boolean;

  subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private configService: ConfigService,
    private cartService: CartService,
    private supportService: SupportService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartStoraged$.subscribe(cart=>{
        this.badgeCart = cart.totalQuantity;
      })
    )

    this.listenConfig();
    this.listenSupport();
  }


  listenConfig() {
    this.subscription.add(
      this.configService.getConfig().subscribe({
        next: (config) => this.configService.set(config),
        error: (err) => console.error('Lỗi lấy cấu hình:', err.message),
        complete: () => console.log('Cấu hình đã được lấy thành công')
      })
    )
  }

  listenSupport() {
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

  toggleDrawerEmit() {
    this.toggleDrawer.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
