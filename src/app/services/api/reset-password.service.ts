import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  
  urlCheckEmail = environment.backendApi+'/forgot-password/check-email';
  urlCheckToken = environment.backendApi+'/forgot-password/check-token';
  urlNewPassword = environment.backendApi+'/forgot-password/new-password';

  checkEmail(email: string){
    return this.httpClient.post(this.urlCheckEmail, {email});
  }

  checkToken(token: string){
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });

    return this.httpClient.get(this.urlCheckToken, {headers});
  }

  newPassword(token: string, newPassword: string){
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });

    return this.httpClient.post(this.urlNewPassword, { newPassword }, { headers })
  }


}
