import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly url:string = environment.backendApi+'/register';

  register(account: Account){
    return this.httpClient.post(this.url, account);
  }
}

export interface Account{
  userName: string,
  password: string,
  name: string,
  emailAddress: string,
  phoneNumber: string
}
