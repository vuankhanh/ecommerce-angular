import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../../../models/pagination.interface';
import { ISuccess } from '../../../models/success.interface';
import { IDelivery, TDeliveryModel } from '../../../models/address.interface';
import { EMPTY, expand, map, Observable, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonalApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly url = environment.backendApi + '/client/address';

  private getAll(name?: string, page?: number, size?: number): Observable<TDelivery> {
    let params = new HttpParams();
    if (name) {
      params = params.append('name', name);
    }
    if (page) {
      params = params.append('page', page);
    }
    if (size) {
      params = params.append('size', size);
    }
    return this.httpClient.get<DeliveryResponse>(this.url, { params }).pipe(
      map(response => response.metaData)
    );
  }

  getAllData(): Observable<TDeliveryModel[]> {
    let page = 1;
    return this.getAll().pipe(
      expand(metaData => {
        page++;
        const paging = metaData.paging;
        return page <= paging.totalPages ? this.getAll('', page) : EMPTY
      }),
      toArray(),
      map((arr: TDelivery[]) => {
        const data = arr.map(res => res.data).flat();
        return data;
      })
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

  getDefault(): Observable<TDeliveryModel> {
    return this.httpClient.get<DeliveryDetailResponse>(`${this.url}/default`).pipe(
      map(response => response.metaData)
    );
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
    if (!deliveryId) {
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