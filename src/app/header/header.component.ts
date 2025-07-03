import { Component, ElementRef, OnInit, OnDestroy, Renderer2, ViewChild, AfterViewInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationStart, Event, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

//Component
import { AlertTitleComponent } from '../sharing/component/alert-title/alert-title.component'

//Model
import { ProductCategory } from '../models/ProductCategory';
import { UserInformation, JwtDecoded } from '../models/UserInformation';
import { Identification } from '../models/Identification';

//Mock Data
import { Menu, MenusList, CustomerMenu } from '../mock-data/menu';

//Service
import { HeaderService } from '../services/header.service';
import { Cart, CartService } from '../services/cart.service';
import { UrlChangeService } from '../services/url-change.service';
import { JwtDecodedService } from '../services/jwt-decoded.service';
import { AuthService } from '../services/auth.service';
import { AppServicesService } from '../services/app-services.service';
import { MainContainerScrollService } from '../services/main-container-scroll.service';
import { CheckTokenService } from '../services/api/check-token.service';
import { ConfigService } from '../services/api/config.service';
import { SocialAuthenticationService } from '../services/api/social-login/social-authentication';

import { Subscription } from 'rxjs';
import { MaterialModule } from '../sharing/module/material';
import { TToken } from '../models/token.interface';
import { PrefixBackendStaticPipe } from '../pipes/prefix-backend.pipe';

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
  menusList: Array<Menu>;
  customerMenu: Array<Menu>;
  productCategorys: Array<ProductCategory> = [];
  currentUrl: string = this.router.url;
  badgeCart: number = 0;
  showAlertAddedToCart: boolean = false;
  screenWidthSize: 'full' | 'normal' | 'mini' = 'normal';

  isLogin$ = this.checkTokenService.check$;
  userInformation$ = this.authService.jwtPayload$;

  isBrowser: boolean;

  subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private ren: Renderer2,
    private bottomSheet: MatBottomSheet,
    public headerService: HeaderService,
    private urlChangeService: UrlChangeService,
    private cartService: CartService,
    private jwtDecodedService: JwtDecodedService,
    public authService: AuthService,
    private appServicesService: AppServicesService,
    private mainContainerScrollService: MainContainerScrollService,
    private checkTokenService: CheckTokenService,
    private configService: ConfigService,
    private socialAuthenticationService: SocialAuthenticationService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.menusList = MenusList;
    this.customerMenu = CustomerMenu;
    this.appServicesService.productCategory$.subscribe(res=>{
      this.productCategorys = res;
      for(let i in this.menusList){
        if(this.menusList[i].route === 'san-pham'){
          this.menusList[i].child = this.productCategorys
        }
      }
    })
    this.closeAlertAddedToCart();
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

    this.listenUserInformation();
    this.listenIsMobile();
  }

  ngAfterViewInit(): void{
    setTimeout(() => {
      this.listentMainContainerScroll();
    }, 300);
  }

  toggleDrawerEmit(){
    this.toggleDrawer.emit();
  }

  listenIsMobile(){
    this.appServicesService.checkScreenWidthSize$.subscribe(res=>{
      this.screenWidthSize = res;
    })
  }

  closeAlertAddedToCart(){
    this.headerService.set(false);
  }

  listentMainContainerScroll(){
    this.subscription.add(
      this.mainContainerScrollService.listenScrollTop$.subscribe(position=>{
        this.changeStyleHeader(position);
      })
    )
  }

  changeStyleHeader(index: number): void{
    if(index){
      this.ren.addClass(this.header?.nativeElement, 'header-container-scrolled')
    }else{
      this.ren.removeClass(this.header?.nativeElement, 'header-container-scrolled');
    }
  }

  listenUserInformation(){
    this.subscription.add(
      this.headerService.get().subscribe(res=>{
        if(!res){
          this.showAlertAddedToCart=res;
        }else{
          setTimeout(() => {
            if(res) {
              if(this.screenWidthSize != 'full'){
                this.bottomSheet.open(AlertTitleComponent, {
                  panelClass: 'add-to-card-bottom-sheet'
                });
              }else{
                this.showAlertAddedToCart=res;
              }
            }
          }, 1);
        }
      })
    );

    this.subscription.add(
      this.configService.getConfig().subscribe({
        next: (config)=> this.configService.set(config),
        error: (err) => console.error('Lỗi lấy cấu hình:', err.message),
        complete: () => console.log('Cấu hình đã được lấy thành công')
      })
    );
  }

  decodeJwtUserInfo(accessToken: string){
    let tokenInformation: JwtDecoded = <JwtDecoded>this.jwtDecodedService.jwtDecoded(accessToken);
    this.authService.setUserInformation(tokenInformation);
  }

  async socialAuthentication(provider: 'google' | 'facebook'){
    try {
      const token: TToken = await this.socialAuthenticationService.authentication(provider);
      this.authService.afterLogin(token);
    } catch (error) {
      
    }
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
