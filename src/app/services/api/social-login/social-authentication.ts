import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Auth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';

import { firstValueFrom, map } from 'rxjs';
import { TToken } from '../../../models/token.interface';
import { TokenResponse } from '../local-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthenticationService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly auth: Auth = inject(Auth);
  private readonly firebaseAuthUrl = environment.backendApi + '/auth/firebase-authentication';

  async authentication(provider: 'google' | 'facebook'): Promise<TToken> {
    if (provider !== 'google' && provider !== 'facebook') return Promise.reject(new Error('Unsupported provider'));

    const resultAuthentication = provider === 'google' ? await this.signInWithGoogle() : await this.signInWithFB();

    const { idToken, email } = resultAuthentication;

    return await this.checkTokenFirebase(idToken, email);
  }

  private async signInWithGoogle(): Promise<{
    idToken: string,
    email: string
  }> {
    const result: UserCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const idToken = await result.user.getIdToken();
    const email = result.user.email ?? '';
    if (!email) {
      throw new Error('auth/invalid-email');
    }
    return { idToken, email };
  }

  private async signInWithFB(): Promise<{
    idToken: string,
    email: string
  }> {
    const result: UserCredential = await signInWithPopup(this.auth, new FacebookAuthProvider());
    const idToken = await result.user.getIdToken();
    const email = result.user.providerData[0]?.email ?? '';
    if (!email) {
      throw new Error('auth/invalid-email');
    }
    return { idToken, email };
  }

  private async checkTokenFirebase(idToken: string, email: string): Promise<TToken> {
    return await firstValueFrom(this.httpClient.post<TokenResponse>(this.firebaseAuthUrl, { idToken, email }).pipe(
      map(res => res.metaData)
    ));
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

