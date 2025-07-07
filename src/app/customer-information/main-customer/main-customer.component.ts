import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { Subscription } from 'rxjs';
import { CustomerMenu, Menu } from '../../mock-data/menu';
import { UrlChangeService } from '../../services/url-change.service';
import { ConfigService } from '../../services/api/config.service';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../sharing/module/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainCustomerRoutingModule } from './main-customer-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenInterceptorService } from '../../services/api/refresh-token-interceptor.service';
import { ReplaceProtocolNamePipe } from '../../sharing/pipe/replace-protocol-name.pipe';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { SanitizeHtmlBindingPipe } from '../../sharing/pipe/sanitize-html-binding.pipe';
import { AddressModifyComponent } from '../../sharing/modal/address-modify/address-modify.component';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AddressBookComponent } from '../address-book/address-book.component';
import { OrderHistoryComponent } from '../order-history/order-history.component';

@Component({
  selector: 'app-main-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainCustomerRoutingModule,

    MaterialModule,

    ReplaceProtocolNamePipe,
    PrefixBackendStaticPipe,
    SanitizeHtmlBindingPipe,

    AddressModifyComponent,

    MainCustomerComponent,
    PersonalInformationComponent,
    ChangePasswordComponent,
    AddressBookComponent,
    OrderHistoryComponent,

    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    }
  ],
  templateUrl: './main-customer.component.html',
  styleUrls: ['./main-customer.component.scss']
})
export class MainCustomerComponent implements OnInit, OnDestroy {
  @ViewChild('userAccordion') userAccordion?: MatAccordion;
  customerMenu: Array<Menu> = CustomerMenu;
  currentUrl: string;
  activeMenu: Menu;
  private subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private urlChangeService: UrlChangeService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.currentUrl = this.router.url;
    this.activeMenu = this.getActiveMenu(this.currentUrl, this.customerMenu);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.urlChangeService.urlChange().subscribe((event) => {
        if (event) {
          this.currentUrl = event.url;
          this.activeMenu = this.getActiveMenu(this.currentUrl, this.customerMenu);
        }
      })
    );



    this.subscription.add(
      this.configService.getConfig().subscribe({
        next: (config) => this.configService.set(config),
        error: (err) => console.error('Lỗi lấy cấu hình:', err.message),
        complete: () => console.log('Cấu hình đã được lấy thành công')
      })
    )
  }

  getActiveMenu(route: string, arrayMenu: Array<Menu>) {
    let index: number = arrayMenu.findIndex(menu => route.includes(menu.route));
    return arrayMenu[index];
  }

  closeAccordion() {
    this.userAccordion?.closeAll();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
