import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../cart.service';
import { environment } from '../../../environments/environment';
import { PaginationParams } from '../../models/PaginationParams';
import { Order } from '../../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private urlOrder = environment.backendApi+'/order';
  private urlOrderInsert = environment.backendApi+'/order/insert';
  // private urlOrderUpdate = environment.backendApi+'/order/update';
  private urlOrderRevoke = environment.backendApi+'/order/revoke';

  private urlOrderFromVisitorsInsert = environment.backendApi+'/order-from-visitors/insert';
  constructor(
    private httpClient: HttpClient
  ) { }

  get(token: string, paginationParams?: PaginationParams){
    let params: HttpParams = new HttpParams();
    if(paginationParams){
      params = params.append('size', paginationParams?.size ? paginationParams?.size : 10);
      params = params.append('page', paginationParams?.page ? paginationParams?.page : 1);
    }

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.get<OrderResponse>(this.urlOrder, { headers, params });
  }

  getDetail(token: string, orderId: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.get<Order>(this.urlOrder+'/'+orderId, { headers });
  }

  insert(token: string, cart: Cart){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });

    return this.httpClient.post<Order>(this.urlOrderInsert, cart, { headers });
  }

  revoke(token: string, _id: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.post<Order>(this.urlOrderRevoke, { _id }, { headers });
  }

  insertFromVitors(cart: Cart){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<Order>(this.urlOrderFromVisitorsInsert, cart, { headers });
  }
}

export interface OrderResponse{
  totalItems: number,
  size: number,
  page: number,
  totalPages: number,
  data: Array<Order>
}

