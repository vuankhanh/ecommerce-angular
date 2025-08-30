import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../sharing/module/material';
import { TMenu } from '../models/menu.interface';
import { getCustomerMenu, getMenu } from '../sharing/constant/menu.constant';
import { AutoExpandMatExpansionPanelDirective } from '../sharing/directive/auto-expand-mat-expansion-panel.directive';
import { PrefixBackendStaticPipe } from '../sharing/pipe/prefix-backend.pipe';
import { FormsModule } from '@angular/forms';
import { LangService } from '../services/lang.service';
import { getLangs } from '../sharing/constant/lang.constant';
import { LangSelectorComponent } from '../sharing/component/lang-selector/lang-selector.component';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,

    LangSelectorComponent,

    PrefixBackendStaticPipe,

    AutoExpandMatExpansionPanelDirective,

    MaterialModule
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly cartService: CartService = inject(CartService)
  private readonly langService: LangService = inject(LangService);

  @ViewChild('accordion') accordion?: MatAccordion;
  @ViewChild('userAccordion') userAccordion?: MatAccordion;
  @Output() toggleDrawer = new EventEmitter();

  menusList: TMenu[] = getMenu();
  customerMenu: TMenu[] = getCustomerMenu();
  langs = getLangs();
  currentLang = 'vi';
  badgeCart = 0;

  userInformation$ = this.authService.jwtPayload$;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartStoraged$.subscribe(cart => {
        this.badgeCart = cart.totalQuantity;
      })
    )

    this.currentLang = this.langService.getCurrentLang();
  }

  navigationMenuItem(length: number, url: string) {
    if (length === 0) {
      this.closeSideMenu();
      this.router.navigate([url]);
    }
  }

  closeSideMenu() {
    this.accordion?.closeAll();
    this.userAccordion?.closeAll();
    this.toggleDrawer.emit();
  }

  login(type: 'login' | 'register') {
    this.authService.login(type);
    this.closeSideMenu();
  }

  logout() {
    this.closeSideMenu();
    this.authService.logout();
  }

  changeLanguage(lang: string){
    console.log(lang);
    this.langService.setLang(lang);
  }

}
