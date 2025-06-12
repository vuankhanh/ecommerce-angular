import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VerifyEmailService } from 'src/app/services/api/verify-email.service';
import { AuthService } from 'src/app/services/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.scss']
})
export class VerificationEmailComponent implements OnInit, OnDestroy {
  result: 'success' | 'failure';
  subscription: Subscription = new Subscription();
  constructor(
    private activatedRoute: ActivatedRoute,
    private verifyEmailService: VerifyEmailService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params=>{
      let userId = params['userId'];
      let emailToken = params['emailToken'];
      this.subscription.add(
        this.verifyEmailService.verify(userId, emailToken).subscribe(res=>{
          this.result = 'success';
        }, error=>{
          this.result = 'failure';
        })
      )
    })
  }

  login(){
    this.authService.login('login');
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
