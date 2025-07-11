import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginationParams } from '../../models/PaginationParams';
import { TOrderModel } from '../../models/order.interface';
import { ISuccess } from '../../models/success.interface';
import { IPagination } from './pagination.interface';
import { map, Observable } from 'rxjs';
import { IOrderCreateRequest } from './order-request.interface';
import { TOrderDetailResponseModel } from '../../models/order-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = environment.backendApi + '/order';

  private urlOrderFromVisitorsInsert = environment.backendApi + '/order-from-visitors/insert';
  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(page?: number, size?: number): Observable<TOrder> {
    let params = new HttpParams();

    if (page != undefined) {
      params = params.append('page', page)
    }
    if (size != undefined) {
      params = params.append('size', size)
    }
    return this.httpClient.get<OrderResponse>(this.url, { params }).pipe(
      map(response => response.metaData)
    )
  }

  getDetail(id: string): Observable<TOrderDetailResponseModel> {
    let params = new HttpParams();
    if (id != undefined) {
      params = params.append('id', id)
    }
    return this.httpClient.get<OrderDetailResponse>(this.url, { params }).pipe(
      map(response => response.metaData)
    );
  }

  create(data: IOrderCreateRequest): Observable<TOrderDetailResponseModel> {
    return this.httpClient.post<OrderDetailResponse>(this.url, data).pipe(
      map(res => res.metaData)
    );
  }
}

export type TOrder = {
  data: TOrderModel[];
  paging: IPagination;
}

export interface OrderResponse extends ISuccess {
  metaData: TOrder;
}

export interface OrderDetailResponse extends ISuccess {
  metaData: TOrderDetailResponseModel;
}