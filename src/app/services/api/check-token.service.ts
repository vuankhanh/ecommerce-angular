import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  private urlCheck: string = environment.backendApi+'/check';

  private bCheck: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private check$: Observable<boolean> = this.bCheck.asObservable();
  constructor(
    private httpClient: HttpClient
  ) { }

  getCheck(token: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.get(this.urlCheck, { headers: headers })
  }

  set(check: boolean){
    this.bCheck.next(check);
  }

  get(){
    return this.check$;
  }
}
