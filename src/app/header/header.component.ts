import { Component, ElementRef, OnInit, OnDestroy, Renderer2, ViewChild, AfterViewInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Identification } from '../models/Identification';

//Mock Data
import { Menu, CustomerMenu } from '../sharing/constant/menu.constant';

//Service
import { CartService } from '../services/cart.service';
import { UrlChangeService } from '../services/url-change.service';
import { JwtDecodedService } from '../services/jwt-decoded.service';
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

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('header', { static: false }) header?: ElementRef;
  @Output() toggleDrawer = new EventEmitter();

  identification?: Identification;
  menusList: Array<TMenu> = Menu;
  customerMenu: Array<TMenu> = CustomerMenu;
  currentUrl: string = this.router.url;
  badgeCart: number = 0;
  showAlertAddedToCart: boolean = false;

  userInformation$ = this.authService.jwtPayload$;

  isBrowser: boolean;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private ren: Renderer2,
    private bottomSheet: MatBottomSheet,
    private urlChangeService: UrlChangeService,
    private cartService: CartService,
    private jwtDecodedService: JwtDecodedService,
    private toastService: ToastService,
    public authService: AuthService,
    private mainContainerScrollService: MainContainerScrollService,
    private socialAuthenticationService: SocialAuthenticationService,
    private readonly inProgressSpinnerService: InProgressSpinnerService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartStoraged$.subscribe(cart=>{
        this.badgeCart = cart.totalQuantity;
      })
    )

    this.subscription.add(
      this.urlChangeService.urlChange().subscribe((event)=>{
        if(event) {
          this.currentUrl = event.url;
        }
      })
    );
  }

  ngAfterViewInit(): void{
    setTimeout(() => {
      this.listentMainContainerScroll();
    }, 300);
  }

  toggleDrawerEmit(){
    this.toggleDrawer.emit();
  }

  listentMainContainerScroll(){
    this.subscription.add(
      this.mainContainerScrollService.listenScrollTop$.pipe(
        map(position=> {
          return !!(position > 0);
        }),
        distinctUntilChanged()
      ).subscribe(notTop=>{
        this.changeStyleHeader(notTop);
      })
    )
  }

  changeStyleHeader(notTop: boolean): void{
    if(notTop){
      this.ren.addClass(this.header?.nativeElement, 'header-container-scrolled')
    }else{
      this.ren.removeClass(this.header?.nativeElement, 'header-container-scrolled');
    }
  }

  async socialAuthentication(provider: 'google' | 'facebook'){
    this.inProgressSpinnerService.progressSpinnerStatus(true);
    try {
      const token: TToken = await this.socialAuthenticationService.authentication(provider);
      this.authService.afterLogin(token);
      this.inProgressSpinnerService.progressSpinnerStatus(false);
    } catch (error: any) {
      if (error.message === 'auth/invalid-email'){
        this.toastService.shortToastError('Không lấy được email', 'Lỗi xác thực');
      }
      this.inProgressSpinnerService.progressSpinnerStatus(false);
    }
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
