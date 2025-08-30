import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { TProductCategoryModel } from '../../models/product-category.interface';
import { ProductCategoryService } from '../../services/api/product-category.service';
import { MaterialModule } from '../../sharing/module/material';
import { BreadCrumbComponent } from '../bread-crumb/bread-crumb.component';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,

    RouterOutlet,
    RouterLink,
    RouterLinkActive,

    BreadCrumbComponent,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  providers: [
    ProductCategoryService
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly productCategoryService: ProductCategoryService = inject(ProductCategoryService);

  productCategorise$: Observable<TProductCategoryModel[]> = this.productCategoryService.getAllData();

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    const slug$ = this.productCategorise$.pipe(
      filter(productCategories => !!productCategories.length),
      map(productCategories => productCategories[0].slug)
    );

    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.children),
        filter(children => !children.length),
        switchMap(() => slug$)
      ).subscribe((slug) => {
        this.router.navigate(['san-pham','danh-muc', slug]);
      })
    );

    this.subscription.add(
      slug$.pipe(
        take(1),
        filter(() => !this.activatedRoute.children.length )
      ).subscribe((slug) => {
        this.router.navigate(['san-pham','danh-muc', slug]);
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
