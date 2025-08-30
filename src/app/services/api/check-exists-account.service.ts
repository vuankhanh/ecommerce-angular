import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class CheckExistsAccountService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private urlCheckUserName = environment.backendApi+'/check-user-name';
  private urlCheckEmail = environment.backendApi+'/check-email';

  checkExistUserName(userName: UserName){
    return this.httpClient.post(this.urlCheckUserName, userName);
  }

  checkExistEmail(email: Email){
    return this.httpClient.post(this.urlCheckEmail, email);
  }
}

export interface UserName{
  userName: string
}

export interface Email{
  email: string
}
