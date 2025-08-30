import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ISuccess } from '../../models/success.interface';
import { map, Observable } from 'rxjs';
import { IOrderCreateRequest } from '../../models/order-request.interface';
import { TOrderDetailModel } from '../../models/order-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private url = environment.backendApi + '/order';
  
  create(data: IOrderCreateRequest): Observable<TOrderDetailModel> {
    return this.httpClient.post<OrderDetailResponse>(this.url, data).pipe(
      map(res => res.metaData)
    );
  }
}

export interface OrderDetailResponse extends ISuccess {
  metaData: TOrderDetailModel;
}