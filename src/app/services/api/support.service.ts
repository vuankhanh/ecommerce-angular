import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Support, SupportDetail } from '../../models/Support';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private urlGetAll: string = environment.backendApi+'/support';
  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(){
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<Array<Support>>(this.urlGetAll, { headers });
  }

  getDetail(route: string){
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<SupportDetail>(this.urlGetAll+'/'+route, { headers });
  }
}
