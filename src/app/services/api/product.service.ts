import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, expand, map, Observable, toArray } from 'rxjs';
import { IProduct, TProductModel } from '../../models/product.interface';
import { ISuccess } from '../../models/success.interface';
import { IPagination } from './pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly url: string = environment.backendApi + '/product';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getAll(name?: string, productCategoryId?: string, page?: number, size?: number): Observable<TProduct> {
    let params = new HttpParams();
    if (name != undefined) {
      params = params.append('name', name)
    }

    if (productCategoryId != undefined) {
      params = params.append('productCategoryId', productCategoryId)
    }

    if (page != undefined) {
      params = params.append('page', page)
    }
    if (size != undefined) {
      params = params.append('size', size)
    }
    return this.httpClient.get<IProductResponse>(this.url, { params }).pipe(
      map(response => response.metaData)
    )
  }

  getAllData() {
    let page = 1;
    return this.getAll().pipe(
      expand(metaData => {
        page++;
        const paging = metaData.paging;
        return page <= paging.totalPages ? this.getAll('', '', page) : EMPTY
      }),
      toArray(),
      map((arr: Array<TProduct>) => {
        const data = arr.map(res => res.data).flat();
        return data;
      })
    );
  }

  getDetail(id?: string, slug?: string): Observable<TProductModel> {
    if( !id && !slug) {
      throw new Error('Id hoặc slug là bắt buộc để lấy chi tiết sản phẩm');
    }

    let params = new HttpParams();
    if (id) params = params.append('id', id);
    if (slug) params = params.append('slug', slug);

    return this.httpClient.get<IProductDetailResponse>(`${this.url}/detail`, { params }).pipe(
      map(response => response.metaData)
    );
  }

  getProductsByCategorySlug(slug: string, page?: number, size?: number): Observable<TProduct> {
    if(!slug) throw new Error('Slug là bắt buộc để lấy danh sách sản phẩm theo danh mục');

    let params = new HttpParams();
    params = params.append('slug', slug);

    return this.httpClient.get<IProductResponse>(this.url+'/by-category-slug' , { params }).pipe(
      map(response => response.metaData)
    )
  }

  create(data: IProduct) {
    return this.httpClient.post<IProductDetailResponse>(this.url, data).pipe(
      map(res => res.metaData)
    );
  }

  update(id: string, data: Partial<IProduct>) {
    if (!id) {
      throw new Error('Id là bắt buộc để cập nhật danh mục sản phẩm');
    }

    let params = new HttpParams();
    params = params.append('id', id)

    return this.httpClient.patch<IProductDetailResponse>(this.url, data, { params }).pipe(
      map(res => res.metaData)
    );
  }

  replace(id: string, data: IProduct) {
    if (!id) {
      throw new Error('Id là bắt buộc để cập nhật danh mục sản phẩm');
    }

    let params = new HttpParams();
    params = params.append('id', id)

    return this.httpClient.put<IProductDetailResponse>(this.url, data, { params }).pipe(
      map(res => res.metaData)
    );
  }

  remove(id: string) {
    if (!id) {
      throw new Error('Id là bắt buộc để cập nhật danh mục sản phẩm');
    }

    let params = new HttpParams();
    params = params.append('id', id)

    return this.httpClient.delete<IProductDetailResponse>(this.url, { params }).pipe(
      map(res => res.metaData)
    );
  }
}

export type TProduct = {
  data: TProductModel[];
  paging: IPagination;
}

export interface IProductResponse extends ISuccess {
  metaData: TProduct;
}

export interface IProductDetailResponse extends ISuccess {
  metaData: TProductModel;
}