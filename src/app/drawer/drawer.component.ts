import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { UrlChangeService } from '../services/url-change.service';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../sharing/module/material';
import { TMenu } from '../models/menu.interface';
import { CustomerMenu, Menu } from '../sharing/constant/menu.constant';
import { AutoExpandMatExpansionPanelDirective } from '../sharing/directive/auto-expand-mat-expansion-panel.directive';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,

    AutoExpandMatExpansionPanelDirective,

    MaterialModule
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  @ViewChild('accordion') accordion?: MatAccordion;
  @ViewChild('userAccordion') userAccordion?: MatAccordion;
  @Output() toggleDrawer = new EventEmitter();

  menusList: Array<TMenu> = Menu;
  customerMenu: Array<TMenu> = CustomerMenu;
  badgeCart: number = 0;
  currentUrl: string = this.router.url;

  userInformation$ = this.authService.jwtPayload$;

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private urlChangeService: UrlChangeService,
    private authService: AuthService,
    private cartService: CartService
  ) {

  }

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartStoraged$.subscribe(cart => {
        this.badgeCart = cart.totalQuantity;
      })
    )

    this.subscription.add(
      this.urlChangeService.urlChange().subscribe((event) => {
        if (event) {
          this.currentUrl = event.url;
        }
      })
    );
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

}
