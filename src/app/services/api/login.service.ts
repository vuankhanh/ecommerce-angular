import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { map, Observable } from 'rxjs';
import { ISuccess } from '../../models/success.interface';
import { IAccessToken, TToken } from '../../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlLogin = environment.backendApi+'/auth/login';
  private urlRefreshToken = environment.backendApi+'/auth/refresh_token';
  constructor(
    private httpClient: HttpClient
  ) { }

  login(userName: UserName){
    return this.httpClient.post(this.urlLogin, userName, { observe: 'response' });
  }

  refreshToken(refreshToken: string){
    return this.httpClient.post<RefreshTokenResponse>(this.urlRefreshToken, { refreshToken }).pipe(
      map(res=>res.metaData)
    );
  }
}

export interface UserName{
  userName: string,
  password: string
}

export interface TokenResponse extends ISuccess {
  metaData: TToken
}

export interface RefreshTokenResponse extends ISuccess {
  metaData: IAccessToken
}