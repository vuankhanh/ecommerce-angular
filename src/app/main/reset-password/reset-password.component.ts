import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ResetPasswordService } from '../../services/api/reset-password.service';
import { ToastService } from '../../services/toast.service';

//Validation Form
import { safePassword, isSameInConfirmPassword } from '../../sharing/validator/validators'

import { filter, map, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly formBuilder: FormBuilder = inject(FormBuilder)
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly resetPasswordService: ResetPasswordService = inject(ResetPasswordService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly authSerivce: AuthService = inject(AuthService);

  newPasswordForm!: FormGroup;
  passwordToken?: string;
  countDown = 0;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      filter(params => !!params['passwordToken']),
      map(params => params['passwordToken'] as string)
    ).subscribe(passwordToken => {
      this.passwordToken = passwordToken;
      this.subscription.add(
        this.resetPasswordService.checkToken(this.passwordToken).subscribe({
          next: () => {
            this.initForm();
          },
          error: () => {
            this.router.navigate([''])
          }
        })
      )
    })
  }

  initForm() {
    this.newPasswordForm = this.formBuilder.group({
      password: ['',
        {
          validators: [Validators.required, safePassword()],
          updateOn: 'blur'
        }
      ],
      confirmPassword: ['',
        {
          validators: [Validators.required, isSameInConfirmPassword()],
          updateOn: 'blur'
        }
      ],
    })
  }

  resetPassword() {
    if (this.newPasswordForm.valid && this.passwordToken) {
      this.subscription.add(
        this.resetPasswordService.newPassword(this.passwordToken, this.newPasswordForm.value.confirmPassword).subscribe({
          next: () => {
            this.toastService.shortToastSuccess('Đã đổi mật khẩu thành công', 'Thành công');
            this.countDown = 3;
            const interval = setInterval(() => {
              this.countDown--;
              if (this.countDown === 0) {
                this.authSerivce.logout().then(() => {
                  this.authSerivce.login('login');
                });
                clearInterval(interval);
              }
            }, 1000);
          }, error: () => {
            this.toastService.shortToastError('Đã có lỗi xảy ra', 'Thất bại');
          }
        })
      )
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
