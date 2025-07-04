import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductCategory } from '../../../models/ProductCategory';
import { PaginationParams } from '../../../models/PaginationParams';

import { AppServicesService } from '../../../services/app-services.service';
import { UrlChangeService } from '../../../services/url-change.service';
import { SEOService } from '../../../services/seo.service';

import { Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../../pipes/prefix-backend.pipe';
import { ProductService } from '../../../services/api/product.service';
import { TProductModel } from '../../../models/product.interface';
import { ReplaceSpacePipe } from '../../../pipes/replace-space.pipe';
import { SkeletonComponent } from '../../../sharing/component/skeleton/skeleton.component';
import { ProductCategoryService } from '../../../services/api/product-category.service';
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
    private seoService: SEOService,
    private readonly productCategoryService: ProductCategoryService
  ) {}

  ngOnInit(): void {
    console.log('ProductCategoryComponent ngOnInit');
    
    this.subscription.add(
      this.activatedRoute.params.pipe(
        map(params => params['productCategory'] as string),
        filter(productCategory => !!productCategory),
        switchMap(productCategory => {
          this.products = [];
          return this.productService.getProductsByCategorySlug(productCategory)
        })
      )
      .subscribe(res => {
        const { data, paging } = res;
        this.products = data;
      })
      // this.activatedRoute.data.pipe(
      //   tap((data) => {
      //     console.log(data);
          
      //   }),
      //   map(data => data['productCategory'])
      // ).subscribe(res => {
      //   console.log(res);
        
      //   let productCategory: ProductCategory = res;
      //   if (productCategory) {
      //     this.seoService.updateTitle(productCategory.name);
      //     this.listenProduct(productCategory.route);
      //   }
      // })
    );
  }

  showDetail(product: TProductModel) {
    console.log(product);
    this.router.navigate(['san-pham/' + product.productCategory?.slug, product.slug]);
  }

  changeIndex(index: number) {
    console.log('Change index = ' + index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
