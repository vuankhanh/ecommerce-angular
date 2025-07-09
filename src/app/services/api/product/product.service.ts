import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.development';
import { ProductCategory } from '../../../models/ProductCategory';
import { Product } from '../../../models/Product';
import { PaginationParams } from '../../../models/PaginationParams';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private urlProductCategory: string = environment.backendApi+'/product-category';
  private urlProductHightlight: string = environment.backendApi+'/product-hightlight';
  private urlProduct: string = environment.backendApi+'/product';
  constructor(
    private httpClient: HttpClient
  ) { }

  getCategory(){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<Array<ProductCategory>>(this.urlProductCategory, { headers })
  }

  getProductHightlight(){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<Array<Product>>(this.urlProductHightlight, { headers });
  }

  getProduct(type: string, paginationParams?: PaginationParams){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let params: HttpParams = new HttpParams();
    if(paginationParams){
      params = params.append('size', paginationParams.size ? paginationParams.size.toString() : '10');
      params = params.append('page', paginationParams.page ? paginationParams.page.toString() : '1');
    }
    
    params = params.append('type', type);
    
    return this.httpClient.get<ProductResponse>(this.urlProduct, { headers: headers, params: params })
  }

  getProductRoute(route: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.get<Product>(this.urlProduct+'/'+route, { headers })
  }
}

export interface ProductResponse{
  totalItems: number,
  size: number,
  page: number,
  totalPages: number,
  data: Array<Product>
}