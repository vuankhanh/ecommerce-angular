import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../../sharing/pipe/prefix-backend.pipe';
import { TProductModel } from '../../../models/product.interface';
import { SkeletonComponent } from '../../../sharing/component/skeleton/skeleton.component';
import { CurrencyCustomPipe } from '../../../sharing/pipe/currency-custom.pipe';
import { isArray } from 'lodash';
@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    
    SkeletonComponent,
    CurrencyCustomPipe,
    PrefixBackendStaticPipe,
],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  products: TProductModel[] = [];

  private readonly subscription: Subscription = new Subscription();
  
  ngOnInit(): void {
    console.log('ProductCategoryComponent ngOnInit');
    this.subscription.add(
      this.activatedRoute.data.subscribe(data => {
        const { productFromCategorySlug } = data;
        this.products = isArray(productFromCategorySlug) ? productFromCategorySlug : [];
      })
    );
    
  }

  showDetail(product: TProductModel) {
    this.router.navigate(['san-pham', product.slug]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
