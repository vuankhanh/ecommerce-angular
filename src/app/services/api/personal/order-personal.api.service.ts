import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ISuccess } from '../../../models/success.interface';
import { IPagination } from '../pagination.interface';
import { map, Observable } from 'rxjs';
import { IOrderCreateRequest } from '../order-request.interface';
import { TOrderDetailModel, TOrderModel } from '../../../models/order-response.interface';
import { OrderStatus } from '../../../sharing/constant/order.constant';

@Injectable({
  providedIn: 'root'
})
export class OrderPersonalApiService {
  private url = environment.backendApi + '/client/order';

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(page?: number, size?: number): Observable<TOrder> {
    let params = new HttpParams();

    if (page != null) {
      params = params.append('page', page)
    }
    if (size != null) {
      params = params.append('size', size)
    }
    return this.httpClient.get<OrderResponse>(this.url, { params }).pipe(
      map(response => response.metaData)
    )
  }

  getDetail(id: string): Observable<TOrderDetailModel> {
    if (!id) {
      throw new Error('Order ID là bắt buộc để lấy chi tiết đơn hàng.');
    }

    let params = new HttpParams();
    params = params.append('id', id);

    return this.httpClient.get<OrderDetailResponse>(this.url + '/detail', { params }).pipe(
      map(response => response.metaData)
    );
  }

  create(data: IOrderCreateRequest): Observable<TOrderDetailModel> {
    return this.httpClient.post<OrderDetailResponse>(this.url, data).pipe(
      map(res => res.metaData)
    );
  }

  updateStatusOrder(id: string, newStatus: `${OrderStatus}`, reasonForCancelReason?: string): Observable<TOrderDetailModel> {
    if (!id) {
      throw new Error('Order ID là bắt buộc để cập nhật trạng thái đơn hàng');
    }

    if (!newStatus) {
      throw new Error('Trạng thái đơn hàng là bắt buộc để cập nhật');
    }

    let params = new HttpParams();
    params = params.append('id', id);
    let data: { status: `${OrderStatus}`; reasonForCancelReason?: string } = { status: newStatus };

    if(newStatus === OrderStatus.CANCELED) {
      if (!reasonForCancelReason) {
        throw new Error('Lý do hủy đơn hàng là bắt buộc khi cập nhật trạng thái CANCELED');
      }
      data.reasonForCancelReason = reasonForCancelReason;
    }

    return this.httpClient.put<OrderDetailResponse>(`${this.url}/status`, data, { params }).pipe(
      map(response => response.metaData)
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
  metaData: TOrderDetailModel;
}