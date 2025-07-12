import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IPagination } from './pagination.interface';
import { ISuccess } from '../../models/success.interface';
import { TDeliveryModel } from '../../models/address.interface';
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