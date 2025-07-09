import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  urlCheckEmail: string = environment.backendApi+'/forgot-password/check-email';
  urlCheckToken: string = environment.backendApi+'/forgot-password/check-token';
  urlNewPassword: string = environment.backendApi+'/forgot-password/new-password';
  constructor(
    private httpClient: HttpClient
  ) { }

  checkEmail(email: string){
    return this.httpClient.post(this.urlCheckEmail, {email});
  }

  checkToken(token: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });

    return this.httpClient.get(this.urlCheckToken, {headers});
  }

  newPassword(token: string, newPassword: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });

    return this.httpClient.post(this.urlNewPassword, { newPassword }, { headers })
  }


}
