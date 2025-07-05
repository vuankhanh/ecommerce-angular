import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../../sharing/pipe/prefix-backend.pipe';
import { ProductService } from '../../../services/api/product.service';
import { TProductModel } from '../../../models/product.interface';
import { SkeletonComponent } from '../../../sharing/component/skeleton/skeleton.component';
import { CurrencyCustomPipe } from '../../../sharing/pipe/currency-custom.pipe';
@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    CommonModule,

    SkeletonComponent,

    CurrencyCustomPipe,
    
    PrefixBackendStaticPipe,
  ],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  products: Array<TProductModel> = [];

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params.pipe(
        map(params => params['productCategory'] as string),
        filter(productCategory => !!productCategory),
        switchMap(productCategory => {
          this.products = [];
          return this.productService.getAllDataByCategorySlug(productCategory);
        })
      )
      .subscribe(res => {
        this.products = res;
        console.log('Products:', this.products);
      })
    );
  }

  showDetail(product: TProductModel) {
    console.log(product);
    
    this.router.navigate(['san-pham/' + product.productCategory?.slug, product.slug]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
