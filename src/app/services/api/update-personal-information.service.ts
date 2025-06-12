import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UpdatePersonalInformationService {
  private urlUpdatePersonal: string = environment.backendApi+'/update-customer';
  constructor(
    private httpClient: HttpClient
  ) { }

  update(token: string, updateInfo: any){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.put<ResponseUpdate>(this.urlUpdatePersonal, updateInfo, { headers: headers, observe: 'response' });
  }
}

export interface ResponseUpdate{
  message: string,
  accessToken: string
}