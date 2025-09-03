import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { Subscription } from 'rxjs';
import { getCustomerMenu } from '../sharing/constant/menu.constant';
import { UrlChangeService } from '../services/url-change.service';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../sharing/module/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TMenu } from '../models/menu.interface';
import { BreakpointDetectionService } from '../services/breakpoint-detection.service';

@Component({
  selector: 'app-main-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterLink,
    RouterLinkActive,
    RouterOutlet,

    MaterialModule,

    MaterialModule
  ],
  providers: [
    
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly breakpointDetectionService: BreakpointDetectionService = inject(BreakpointDetectionService)
  private readonly urlChangeService: UrlChangeService = inject(UrlChangeService);
  private readonly authService: AuthService = inject(AuthService);

  @ViewChild('userAccordion') userAccordion?: MatAccordion;
  customerMenu: TMenu[] = getCustomerMenu();
  currentUrl = this.router.url;
  activeMenu: TMenu = this.getActiveMenu(this.currentUrl, this.customerMenu);

  isMobile$ = this.breakpointDetectionService.detection$();
  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.urlChangeService.urlChange().subscribe((event) => {
        if (event) {
          this.currentUrl = event.url;
          this.activeMenu = this.getActiveMenu(this.currentUrl, this.customerMenu);
        }
      })
    );
  }

  private getActiveMenu(route: string, arrayMenu: TMenu[]) {
    const index = arrayMenu.findIndex(menu => route.includes(menu.route!));
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
