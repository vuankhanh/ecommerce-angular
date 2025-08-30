import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private urlVerifyEmail = environment.backendApi+'/verify-email'

  verify(userId: string, emailToken: string){
    let params: HttpParams = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('emailToken', emailToken);

    return this.httpClient.get(this.urlVerifyEmail, { params });
  }
}
