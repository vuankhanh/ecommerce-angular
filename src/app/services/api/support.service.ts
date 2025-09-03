import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Support, SupportDetail } from '../../models/Support';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly urlGetAll = environment.backendApi+'/support';

  getAll(){
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<Support[]>(this.urlGetAll, { headers });
  }

  getDetail(route: string){
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<SupportDetail>(this.urlGetAll+'/'+route, { headers });
  }
}
