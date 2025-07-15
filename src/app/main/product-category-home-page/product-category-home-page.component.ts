import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../sharing/component/skeleton/skeleton.component';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { ProductService } from '../../services/api/product.service';
import { TProductCategoryModel } from '../../models/product-category.interface';
import { TProductModel } from '../../models/product.interface';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';

@Component({
  selector: 'app-product-category-home-page',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,

    CurrencyCustomPipe,

    SkeletonComponent
  ],
  templateUrl: './product-category-home-page.component.html',
  styleUrls: ['./product-category-home-page.component.scss']
})
export class ProductCategoryHomePageComponent implements OnInit, OnDestroy {
  @Input() productCategory?: TProductCategoryModel;
  @Input() isSameCategory?: boolean;
  @Output() emitChangeRoute: EventEmitter<string> = new EventEmitter();

  products: TProductModel[] = [];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    if (!this.productCategory) {
      return;
    }

    this.subscription.add(
      this.productService.getAll('', this.productCategory._id).subscribe(res => {
        // this.productResponse = res;
        const data = res.data;
        this.products = data;
      })
    )
  }

  // listenProduct(type: string) {
  //   this.subscription.add(
  //     this.productService.getProduct(type).subscribe(res => {
  //       this.productResponse = res;
  //       this.configPagination = {
  //         totalItems: this.productResponse.totalItems,
  //         page: this.productResponse.page,
  //         size: this.productResponse.size,
  //         totalPages: this.productResponse.totalPages
  //       };
  //       this.products = this.productResponse.data;
  //     })
  //   )
  // }

  showDetail(product: TProductModel) {
    this.router.navigate(['san-pham/' + this.productCategory?.slug, product.slug]);
    this.emitChangeRoute.emit(product.slug);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
