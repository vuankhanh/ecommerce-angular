import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../pagination.interface';
import { ISuccess } from '../../../models/success.interface';
import { IDelivery, TDeliveryModel } from '../../../models/address.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private readonly url: string = environment.backendApi + '/client/address';
  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<TDelivery> {
    return this.httpClient.get<DeliveryResponse>(this.url).pipe(
      map(response => response.metaData)
    );
  }

  getDetail(deliveryId: string): Observable<TDeliveryModel> {
    if (!deliveryId) {
      throw new Error('Delivery ID là bắt buộc để lấy chi tiết địa chỉ.');
    }
    let params: HttpParams = new HttpParams();
    params = params.append('deliveryId', deliveryId);

    return this.httpClient.get<DeliveryDetailResponse>(`${this.url}/detail`, { params }).pipe(
      map(response => response.metaData)
    )
  }

  create(delivery: IDelivery): Observable<TDeliveryModel> {
    return this.httpClient.post<DeliveryDetailResponse>(this.url, delivery).pipe(
      map(response => response.metaData)
    );
  }

  update(deliveryId: string, partialDelivery: Partial<IDelivery>): Observable<TDeliveryModel> {
    if (!deliveryId) {
      throw new Error('Delivery ID là bắt buộc để cập nhật địa chỉ.');
    }
    if (!partialDelivery || Object.keys(partialDelivery).length === 0) {
      throw new Error('Partial delivery data is required to update the address.');
    }

    let params: HttpParams = new HttpParams();
    params = params.append('deliveryId', deliveryId);

    return this.httpClient.patch<DeliveryDetailResponse>(`${this.url}`, partialDelivery, { params }).pipe(
      map(response => response.metaData)
    );
  }

  setDefault(deliveryId: string): Observable<TDeliveryModel> {
    if (!deliveryId) {
      throw new Error('Delivery ID là bắt buộc để đặt địa chỉ làm mặc định.');
    }
    let params: HttpParams = new HttpParams();
    params = params.append('deliveryId', deliveryId);

    return this.httpClient.patch<DeliveryDetailResponse>(`${this.url}/set-default`, {}, { params }).pipe(
      map(response => response.metaData)
    );
  }

  remove(deliveryId: string): Observable<TDeliveryModel> {
    if(!deliveryId) {
      throw new Error('Delivery ID là bắt buộc để xóa địa chỉ.');
    }
    let params: HttpParams = new HttpParams();
    params = params.append('deliveryId', deliveryId);

    return this.httpClient.delete<DeliveryDetailResponse>(`${this.url}`, { params }).pipe(
      map(response => response.metaData)
    );
  }
}

export type TDelivery = {
  data: TDeliveryModel[];
  paging: IPagination;
}

export interface DeliveryResponse extends ISuccess {
  metaData: TDelivery;
}

export interface DeliveryDetailResponse extends ISuccess {
  metaData: TDeliveryModel;
}