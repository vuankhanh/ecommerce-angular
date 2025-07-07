import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private urlConfig: string = environment.backendApi+'/config';

  private orderStatus: Array<any> = [];
  private bConfig: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  config$: Observable<any> = this.bConfig.asObservable();
  constructor(
    private httpClient: HttpClient
  ) { }

  getConfig(){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(this.urlConfig, { headers: headers })
  }

  set(config: any){
    this.orderStatus = config.orderStatus;
    this.bConfig.next(config);
  }

  filterNameOrderStatus(code: string){
    if(this.orderStatus){
      let index: number = this.orderStatus.findIndex(status=>status.code === code);
      return index >=0 ? this.orderStatus[index].name : null
    }else{
      return null;
    }
  }
}
