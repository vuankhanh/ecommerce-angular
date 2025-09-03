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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LangLocalePipe } from '../sharing/pipe/lang.pipe';
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
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly langLocalePipe: LangLocalePipe = inject(LangLocalePipe);

  @Output() toggleDrawer = new EventEmitter();
  currentLang = 'vi';
  sanitizedFacebookUrl!: SafeResourceUrl;
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
    this.updateFacebookUrl();
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

  private updateFacebookUrl() {
    const locale = this.currentLang ? this.langLocalePipe.transform(this.currentLang, 'locale') : 'vi_VN';
    const url = `https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fbep.4.than&width=450&layout&action&size&share=true&height=35&appId&locale=${locale}`;
    this.sanitizedFacebookUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleDrawerEmit() {
    this.toggleDrawer.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
