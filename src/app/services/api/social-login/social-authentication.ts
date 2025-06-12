import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";

import { ResponseLogin } from '../login.service';
import { InProgressSpinnerService } from '../../in-progress-spinner.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthenticationService {
  private urlGoogle: string = environment.backendApi+'/auth-google';
  private urlFacebook: string = environment.backendApi+'/auth-facebook';
  constructor(
    private httpClient: HttpClient,
    private socialAuthService: SocialAuthService,
    private inProgressSpinnerService: InProgressSpinnerService
  ) { }

  async signInWithGoogle(): Promise<ResponseLogin> {
    return new Promise(async(resolve, reject)=>{
      try {
        let socialUser: SocialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
        
        let access_token = socialUser.authToken;
        this.inProgressSpinnerService.progressSpinnerStatus(true);
        this.httpClient.post<ResponseLogin>(this.urlGoogle, { access_token }).subscribe(result=>{
          this.inProgressSpinnerService.progressSpinnerStatus(false);
          resolve(result);
        },error=>{
          this.inProgressSpinnerService.progressSpinnerStatus(false);
          reject(error);
        });
      } catch (error) {
        this.inProgressSpinnerService.progressSpinnerStatus(false);
        reject(error);
      }
    })
  }

  signInWithFB(): Promise<ResponseLogin> {
    return new Promise(async(resolve, reject)=>{
      try {
        let socialUser: SocialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
        
        let access_token = socialUser.authToken;
        this.inProgressSpinnerService.progressSpinnerStatus(true);
        this.httpClient.post<ResponseLogin>(this.urlFacebook, { access_token }).subscribe(result=>{
          this.inProgressSpinnerService.progressSpinnerStatus(false);
          resolve(result);
        },error=>{
          this.inProgressSpinnerService.progressSpinnerStatus(false);
          reject(error);
        });
      } catch (error) {
        this.inProgressSpinnerService.progressSpinnerStatus(false);
        reject(error);
      }
    })
  }

  signOut(): void {
    this.socialAuthService.signOut().catch(err=>{
      console.log(err);
    });
  }
}
