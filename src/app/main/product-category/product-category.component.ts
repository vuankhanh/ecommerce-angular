import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductCategory } from '../../models/ProductCategory';
import { PaginationParams } from 'src/app/models/PaginationParams';
import { Product } from 'src/app/models/Product';

import { ProductResponse, ProductService } from 'src/app/services/api/product/product.service';
import { AppServicesService } from 'src/app/services/app-services.service';
import { UrlChangeService } from 'src/app/services/url-change.service';
import { SEOService } from 'src/app/services/seo.service';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  private child: any;

  productResponse: ProductResponse;
  configPagination: PaginationParams;
  
  products: Array<Product>;
  productCategory: ProductCategory;
  productCategorys: Array<ProductCategory>;

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appServicesService: AppServicesService,
    private productService: ProductService,
    private urlChangeService: UrlChangeService,
    private seoService: SEOService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.data.pipe(
        map(data => data.productCategory)
      ).subscribe(res=>{
        let productCategory: ProductCategory = res;
        if(productCategory){
          this.seoService.updateTitle(productCategory.name);
          this.listenProduct(productCategory.route);
        }
      })
    );
  }

  listenProduct(type: string){
    this.subscription.add(
      this.productService.getProduct(type).subscribe(res=>{
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

  getCategoryIsActivated(category: string){
    this.subscription.add(
      this.appServicesService.productCategory$.subscribe(res=>{
        if(res.length){
          this.productCategorys = res;
          let index: number = this.productCategorys.findIndex(productCategory=>category === productCategory.route);
          if(index>=0){
            this.productCategory = this.productCategorys[index];
            this.listenProduct(this.productCategory.route);
          }else{
            this.router.navigate(['/san-pham/'+this.productCategorys[0].route])
          }
        }
      })
    )
  }

  showDetail(product: Product){
    this.router.navigate(['san-pham/'+product.category.route, product.route]);
  }

  changeIndex(index: number){
    console.log('Change index = ' + index);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
