import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductCategory } from '../../models/ProductCategory';
import { PaginationParams } from '../../models/PaginationParams';

import { AppServicesService } from '../../services/app-services.service';
import { UrlChangeService } from '../../services/url-change.service';
import { SEOService } from '../../services/seo.service';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../pipes/prefix-backend.pipe';
import { ProductService } from '../../services/api/product.service';
import { TProductModel } from '../../models/product.interface';
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe';
import { SkeletonComponent } from '../../sharing/component/skeleton/skeleton.component';
@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    CommonModule,

    SkeletonComponent,
    
    PrefixBackendStaticPipe,
    ReplaceSpacePipe
  ],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  private child: any;

  configPagination?: PaginationParams;

  products: Array<TProductModel> = [];
  productCategory?: ProductCategory;
  productCategorys: Array<ProductCategory> = [];

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appServicesService: AppServicesService,
    private productService: ProductService,
    private urlChangeService: UrlChangeService,
    private seoService: SEOService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.data.pipe(
        map(data => data['productCategory'])
      ).subscribe(res => {
        let productCategory: ProductCategory = res;
        if (productCategory) {
          this.seoService.updateTitle(productCategory.name);
          this.listenProduct(productCategory.route);
        }
      })
    );
  }

  listenProduct(type: string) {
    this.subscription.add(
      this.productService.getAll('', type).subscribe(res => {
        const {data, paging} = res
        this.products = data;
        // this.productResponse = res;
        // this.configPagination = {
        //   totalItems: this.productResponse.totalItems,
        //   page: this.productResponse.page,
        //   size: this.productResponse.size,
        //   totalPages: this.productResponse.totalPages
        // };
      })
    )
  }

  getCategoryIsActivated(category: string) {
    this.subscription.add(
      this.appServicesService.productCategory$.subscribe(res => {
        if (res.length) {
          this.productCategorys = res;
          let index: number = this.productCategorys.findIndex(productCategory => category === productCategory.route);
          if (index >= 0) {
            this.productCategory = this.productCategorys[index];
            this.listenProduct(this.productCategory.route);
          } else {
            this.router.navigate(['/san-pham/' + this.productCategorys[0].route])
          }
        }
      })
    )
  }

  showDetail(product: TProductModel) {
    this.router.navigate(['san-pham/' + product.productCategory?.slug, product.slug]);
  }

  changeIndex(index: number) {
    console.log('Change index = ' + index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
