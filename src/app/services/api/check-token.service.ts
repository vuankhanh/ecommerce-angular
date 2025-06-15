import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  private readonly urlCheck: string = environment.backendApi+'/auth/config';

  private readonly bCheck: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly check$: Observable<boolean> = this.bCheck.asObservable();
  constructor(
    private httpClient: HttpClient
  ) { }

  getCheck(token: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token
    });
    return this.httpClient.post(this.urlCheck, {}, { headers: headers })
  }

  set(check: boolean){
    this.bCheck.next(check);
  }
}
