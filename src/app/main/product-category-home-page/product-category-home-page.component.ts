import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { PaginationParams } from '../../models/PaginationParams';
import { Product } from '../../models/Product';
import { ProductCategory } from '../../models/ProductCategory';

import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe';
import { SkeletonComponent } from '../../sharing/component/skeleton/skeleton.component';
import { PrefixBackendStaticPipe } from '../../pipes/prefix-backend.pipe';
import { ProductService } from '../../services/api/product.service';
import { TProductCategoryModel } from '../../models/product-category.interface';
import { TProductModel } from '../../models/product.interface';

@Component({
  selector: 'app-product-category-home-page',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,
    ReplaceSpacePipe,

    SkeletonComponent
  ],
  templateUrl: './product-category-home-page.component.html',
  styleUrls: ['./product-category-home-page.component.scss']
})
export class ProductCategoryHomePageComponent implements OnInit, OnDestroy {
  @Input() productCategory?: TProductCategoryModel;
  @Input() isSameCategory?: boolean;
  @Output() emitChangeRoute: EventEmitter<string> = new EventEmitter();

  configPagination?: PaginationParams;
  products: TProductModel[] = [];
  productCategorys: Array<ProductCategory> = [];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    if (!this.productCategory) {
      return;
    }

    console.log(this.productCategory);
    
    this.subscription.add(
      this.productService.getAll('', this.productCategory._id).subscribe(res => {
        // this.productResponse = res;
        const data = res.data;
        this.products = data;
        console.log(this.products);
        
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
