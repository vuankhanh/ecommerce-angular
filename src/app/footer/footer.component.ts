import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Identification } from '../models/Identification';

import { CartService } from '../services/cart.service';
import { SupportService } from '../services/api/support.service';

import { Subscription } from 'rxjs';
import { Support } from '../models/Support';
import { MaterialModule } from '../sharing/module/material';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TMenu } from '../models/menu.interface';
import { getMenu } from '../sharing/constant/menu.constant';
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
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly cartService: CartService = inject(CartService);
  private readonly supportService: SupportService = inject(SupportService);

  @Output() toggleDrawer = new EventEmitter();
  identification?: Identification;

  badgeCart = 0;
  menusList: TMenu[] = getMenu();

  supports: Support[] = [];

  isBrowser: boolean = isPlatformBrowser(this.platformId);

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartStoraged$.subscribe(cart=>{
        this.badgeCart = cart.totalQuantity;
      })
    );

    this.listenSupport();
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
