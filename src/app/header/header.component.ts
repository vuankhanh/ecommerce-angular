import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Output, EventEmitter, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Identification } from '../models/Identification';

//Mock Data
import { getMenu, getCustomerMenu } from '../sharing/constant/menu.constant';

//Service
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { MainContainerScrollService } from '../services/main-container-scroll.service';
import { SocialAuthenticationService } from '../services/api/social-login/social-authentication';

import { distinctUntilChanged, map, Subscription } from 'rxjs';
import { MaterialModule } from '../sharing/module/material';
import { TToken } from '../models/token.interface';
import { PrefixBackendStaticPipe } from '../sharing/pipe/prefix-backend.pipe';
import { InProgressSpinnerService } from '../services/in-progress-spinner.service';
import { TMenu } from '../models/menu.interface';
import { ToastService } from '../services/toast.service';
import { FormsModule } from '@angular/forms';
import { LangSelectorComponent } from '../sharing/component/lang-selector/lang-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,

    LangSelectorComponent,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly cartService: CartService = inject(CartService);
  private readonly toastService: ToastService = inject(ToastService);
  public readonly authService: AuthService = inject(AuthService);
  private readonly mainContainerScrollService: MainContainerScrollService = inject(MainContainerScrollService);
  private readonly socialAuthenticationService: SocialAuthenticationService = inject(SocialAuthenticationService);
  private readonly inProgressSpinnerService: InProgressSpinnerService = inject(InProgressSpinnerService);
  @ViewChild('header', { static: false }) header?: ElementRef;
  @Output() toggleDrawer = new EventEmitter();

  identification?: Identification;
  menusList: TMenu[] = getMenu();
  customerMenu: TMenu[] = getCustomerMenu();

  badgeCart = 0;
  showAlertAddedToCart = false;

  userInformation$ = this.authService.jwtPayload$;

  isBrowser = isPlatformBrowser(this.platformId);

  isNotAtTop$ = this.mainContainerScrollService.listenScrollTop$.pipe(
    map(position => {
      return position > 0;
    }),
    distinctUntilChanged()
  )

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartStoraged$.subscribe(cart => {
        this.badgeCart = cart.totalQuantity;
      })
    )
  }

  toggleDrawerEmit() {
    this.toggleDrawer.emit();
  }

  async socialAuthentication(provider: 'google' | 'facebook') {
    this.inProgressSpinnerService.progressSpinnerStatus(true);
    try {
      const token: TToken = await this.socialAuthenticationService.authentication(provider);
      this.authService.afterLogin(token);
      this.inProgressSpinnerService.progressSpinnerStatus(false);
    } catch (error: any) {
      if (error.message === 'auth/invalid-email') {
        this.toastService.shortToastError('Không lấy được email', 'Lỗi xác thực');
      }
      this.inProgressSpinnerService.progressSpinnerStatus(false);
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
