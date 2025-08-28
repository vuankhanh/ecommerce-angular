import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, expand, map, Observable, toArray } from 'rxjs';
import { IProductCategory, TProductCategoryModel } from '../../models/product-category.interface';
import { IPagination } from '../../models/pagination.interface';
import { ISuccess } from '../../models/success.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private readonly url: string = environment.backendApi + '/product-category';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getAll(name?: string, page?: number, size?: number): Observable<TProductCategory> {
    let params = new HttpParams();
    if (name != null) {
      params = params.append('name', name)
    }
    if (page != null) {
      params = params.append('page', page)
    }
    if (size != null) {
      params = params.append('size', size)
    }
    return this.httpClient.get<IProductCategoryResponse>(this.url).pipe(
      map(response => response.metaData)
    )
  }

  getAllData() {
    let page = 1;
    return this.getAll().pipe(
      expand(metaData => {
        page++;
        const paging = metaData.paging;
        return page <= paging.totalPages ? this.getAll('', page) : EMPTY
      }),
      toArray(),
      map((arr: Array<TProductCategory>) => {
        const data = arr.map(res=>res.data).flat();
        return data;
      })
    );
  }

  getDetail(slug?: string): Observable<TProductCategoryModel> {
    if (!slug) {
      throw new Error('Slug là bắt buộc để cập nhật danh mục sản phẩm');
    }

    let params = new HttpParams();
    if(slug) params = params.append('slug', slug);

    return this.httpClient.get<IProductCategoryDetailResponse>(`${this.url}/detail`, { params }).pipe(
      map(response => response.metaData)
    );
  }
}

export type TProductCategory = {
  data: TProductCategoryModel[];
  paging: IPagination;
}

export interface IProductCategoryResponse extends ISuccess {
  metaData: TProductCategory;
}

export interface IProductCategoryDetailResponse extends ISuccess {
  metaData: TProductCategoryModel;
}