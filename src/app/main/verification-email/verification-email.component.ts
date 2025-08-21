import { Component } from '@angular/core';
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
  result$: Observable<boolean> = this.activatedRoute.queryParams.pipe(
    map(params => {
      let userId = params['userId'];
      let emailToken = params['emailToken'];
      return {
        userId,
        emailToken
      }
    }),
    filter(params => !!params.userId && !!params.emailToken),
    switchMap(({ userId, emailToken }) => this.verifyEmailService.verify(userId, emailToken).pipe(
      map(res => res ? true : false),
      catchError(_=> of(false))
    )),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private verifyEmailService: VerifyEmailService,
    private authService: AuthService
  ) { }

  login() {
    this.authService.login('login');
  }
}
