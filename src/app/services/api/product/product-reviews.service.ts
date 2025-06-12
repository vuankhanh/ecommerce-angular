import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PaginationParams } from '../../../models/PaginationParams';
import { ProductReviews } from '../../../models/ProductReviews';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewsService {
  private urlTotalProductReviews: string = environment.backendApi+'/product-reviews-total';
  private urlProductReviews: string = environment.backendApi+'/product-reviews';
  private urlProductReviewsInsert: string = environment.backendApi+'/product-reviews/insert';
  constructor(
    private httpClient: HttpClient
  ) { }
  
  getTotal(productId: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let params: HttpParams = new HttpParams();
    params = params.append('productId', productId);

    return this.httpClient.get<TotalProductReviewsResponse>(this.urlTotalProductReviews, { headers, params }).pipe(
      map(totalProductReviewsReponse=>{
        let totalRating = 0;
        let existRating = 0;

        totalRating += totalProductReviewsReponse.level1*1;
        existRating += totalProductReviewsReponse.level1;

        totalRating += totalProductReviewsReponse.level2*2;
        existRating += totalProductReviewsReponse.level2;

        totalRating += totalProductReviewsReponse.level3*3;
        existRating += totalProductReviewsReponse.level3;

        totalRating += totalProductReviewsReponse.level4*4;
        existRating += totalProductReviewsReponse.level4;

        totalRating += totalProductReviewsReponse.level5*5;
        existRating += totalProductReviewsReponse.level5;

        let averageRating = parseFloat((totalRating/existRating).toFixed(2)) || 0;
        let totalProductReviews: TotalProductReviews = {
          totalProductReviewsReponse ,
          totalRating,
          existRating,
          averageRating
        }
        return totalProductReviews;
      })
    );
  }

  get(productId: string, paginationParams?: PaginationParams){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let params: HttpParams = new HttpParams();
    params = params.append('productId', productId);
    if(paginationParams){
      params = params.append('size', paginationParams?.size ? paginationParams?.size : 10);
      params = params.append('page', paginationParams?.page ? paginationParams?.page : 1);
    }

    return this.httpClient.get<ProductReviewsResponse>(this.urlProductReviews, { headers, params });
  }

  insert(reviewsWillUpload: ReviewsWillUpload){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(this.urlProductReviewsInsert, reviewsWillUpload, { headers });
  }
}

export interface ReviewsWillUpload{
  productId: string,
  clientInformation: {
    name: string,
    phoneNumber: string
  },
  content: string,
  rating: number
}

interface TotalProductReviewsResponse{
  level1: number,
  level2: number,
  level3: number,
  level4: number,
  level5: number,
}

export interface TotalProductReviews{
  totalProductReviewsReponse: TotalProductReviewsResponse,
  totalRating: number,
  existRating: number,
  averageRating: number
}

export interface ProductReviewsResponse{
  totalItems: number,
  size: number,
  page: number,
  totalPages: number,
  data: Array<ProductReviews>
}