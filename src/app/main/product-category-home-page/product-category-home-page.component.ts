import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { PaginationParams } from '../../models/PaginationParams';
import { Product } from '../../models/Product';
import { ProductCategory } from '../../models/ProductCategory';

import { ProductResponse, ProductService } from '../../services/api/product/product.service';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GalleryRoutePipe } from '../../pipes/gallery-route.pipe';
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe';
import { SkeletonComponent } from '../../sharing/component/skeleton/skeleton.component';

@Component({
  selector: 'app-product-category-home-page',
  standalone: true,
  imports: [
    CommonModule,

    GalleryRoutePipe,
    ReplaceSpacePipe,

    SkeletonComponent
  ],
  templateUrl: './product-category-home-page.component.html',
  styleUrls: ['./product-category-home-page.component.scss']
})
export class ProductCategoryHomePageComponent implements OnInit, OnDestroy {
  @Input() category: string = '';
  @Input() isSameCategory?: boolean;
  @Output() emitChangeRoute: EventEmitter<string> = new EventEmitter();

  productResponse?: ProductResponse;
  configPagination?: PaginationParams;
  products: Array<Product> = [];
  productCategorys: Array<ProductCategory> = [];

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.listenProduct(this.category);
  }

  listenProduct(type: string) {
    this.subscription.add(
      this.productService.getProduct(type).subscribe(res => {
        this.productResponse = res;
        this.configPagination = {
          totalItems: this.productResponse.totalItems,
          page: this.productResponse.page,
          size: this.productResponse.size,
          totalPages: this.productResponse.totalPages
        };
        this.products = this.productResponse.data;
      })
    )
  }

  showDetail(product: Product) {
    this.router.navigate(['san-pham/' + this.category, product.route]);
    this.emitChangeRoute.emit(product.route);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
