import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstimateFeeService {
  private urlEstimateFee: string = environment.backendApi+'/customer/estimate-shipping-fee';
  constructor(
    private httpClient: HttpClient
  ) { }
  
  getEstimateFee(token: string, addressId: string, totalValue: number){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.post(this.urlEstimateFee, { addressId, totalValue }, { headers });
  }
}
