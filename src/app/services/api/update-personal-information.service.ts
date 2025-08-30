import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class UpdatePersonalInformationService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private urlUpdatePersonal = environment.backendApi+'/update-customer';

  update(token: string, updateInfo: any){
    const headers: HttpHeaders = new HttpHeaders({
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