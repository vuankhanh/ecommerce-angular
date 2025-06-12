import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private url:string = environment.backendApi+'/register';
  constructor(
    private httpClient: HttpClient
  ) { }

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
