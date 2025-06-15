import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InProgressSpinnerService } from '../../in-progress-spinner.service';
import { environment } from '../../../../environments/environment';
import { Auth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';

import { FirebaseError } from 'firebase/app';
import { firstValueFrom, map } from 'rxjs';
import { ITokenResponse, TToken } from '../../../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthenticationService {
  private firebaseAuthUrl: string = environment.backendApi + '/auth/firebase-authentication';
  constructor(
    private httpClient: HttpClient,
    private auth: Auth,
    private inProgressSpinnerService: InProgressSpinnerService
  ) { }

  async authentication(provider: 'google' | 'facebook'): Promise<TToken> {
    this.inProgressSpinnerService.progressSpinnerStatus(true);
    let resultAuthentication;
    if (provider !== 'google' && provider !== 'facebook') return Promise.reject(new Error('Unsupported provider'));

    if (provider === 'google') {
      resultAuthentication = await this.signInWithGoogle();
    } else {
      resultAuthentication = await this.signInWithFB();
    }
    const { idToken, email } = resultAuthentication;
    
    return await this.checkTokenFirebase(idToken, email);
  }

  private async signInWithGoogle(): Promise<{
    idToken: string,
    email: string
  }> {
    try {
      const result: UserCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();
      const email = result.user.email || '';
      if (!email) {
        return Promise.reject(new FirebaseError('auth/invalid-email', 'Email is required for linking with Firebase'));
      }
      return { idToken, email };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async signInWithFB(): Promise<{
    idToken: string,
    email: string
  }> {
    try {
      const result: UserCredential = await signInWithPopup(this.auth, new FacebookAuthProvider());
      const idToken = await result.user.getIdToken();
      const email = result.user.providerData[0]?.email || '';
      if (!email) {
        return Promise.reject(new FirebaseError('auth/invalid-email', 'Email is required for linking with Firebase'));
      }
      return { idToken, email };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async checkTokenFirebase(idToken: string, email: string): Promise<TToken> {
    try {
      return await firstValueFrom(this.httpClient.post<ITokenResponse>(this.firebaseAuthUrl, { idToken, email }).pipe(
      map(res=>res.metaData)
      ));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  signOut(): Promise<void> {
    return signOut(this.auth)
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  get idToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() ?? Promise.resolve(null);
  }
}

