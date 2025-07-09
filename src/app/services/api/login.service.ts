import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { map, Observable } from 'rxjs';
import { IRefreshTokenResponse } from '../../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlLogin = environment.backendApi+'/login';
  private urlRefreshToken = environment.backendApi+'/refresh-token';
  constructor(
    private httpClient: HttpClient
  ) { }

  login(userName: UserName){
    return this.httpClient.post(this.urlLogin, userName, { observe: 'response' });
  }

  refreshToken(refreshToken: string){
    return this.httpClient.post<IRefreshTokenResponse>(this.urlRefreshToken, { refreshToken }).pipe(
      map(res=>res.metaData)
    );
  }
}

export interface UserName{
  userName: string,
  password: string
}