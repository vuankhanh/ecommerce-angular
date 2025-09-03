import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { VerifyEmailService } from '../../services/api/verify-email.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verification-email',
  standalone: true,
  imports: [
    CommonModule,

    MaterialModule
  ],
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.scss']
})
export class VerificationEmailComponent {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly verifyEmailService: VerifyEmailService = inject(VerifyEmailService);
  private readonly authService: AuthService = inject(AuthService);

  result$: Observable<boolean> = this.activatedRoute.queryParams.pipe(
    map(params => {
      const userId = params['userId'];
      const emailToken = params['emailToken'];
      return {
        userId,
        emailToken
      }
    }),
    filter(params => !!params.userId && !!params.emailToken),
    switchMap(({ userId, emailToken }) => this.verifyEmailService.verify(userId, emailToken).pipe(
      map(res => !!res),
      catchError(()=> of(false))
    )),
  );

  login() {
    this.authService.login('login');
  }
}
