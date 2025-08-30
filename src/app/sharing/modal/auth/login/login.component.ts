import { Component, OnInit, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Service

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LocalAuthenticationService, TokenResponse } from '../../../../services/api/local-authentication.service';
import { ToastService } from '../../../../services/toast.service';
import { SocialAuthenticationService } from '../../../../services/api/social-login/social-authentication';
import { InProgressSpinnerService } from '../../../../services/in-progress-spinner.service';
import { MaterialModule } from '../../../module/material';
import { TToken } from '../../../../models/token.interface';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly localAuthenticationService: LocalAuthenticationService = inject(LocalAuthenticationService);
  private readonly authService: AuthService = inject(AuthService)
  private readonly socialAuthenticationService: SocialAuthenticationService = inject(SocialAuthenticationService);
  private readonly toastService: ToastService = inject(ToastService)
  private readonly inProgressSpinnerService: InProgressSpinnerService = inject(InProgressSpinnerService);

  @Output() valueChange = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  loginGroup!: FormGroup;
  fieldTextType = false;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.loginGroup = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginGroup.valid) {
      this.inProgressSpinnerService.progressSpinnerStatus(true);
      this.subscription.add(
        this.localAuthenticationService.login(this.loginGroup.value).subscribe({
          next: (res: TokenResponse) => {
            this.inProgressSpinnerService.progressSpinnerStatus(false);
            if (res.statusCode === 205) {
              this.toastService.shortToastWarning('Tài khoản chưa kích hoạt', 'Đăng nhập');
            } else if (res.statusCode === 200) {
              this.closeModal.emit(res.metaData);
              this.toastService.shortToastSuccess('Đăng nhập thành công', '');
            }
          },
          error: (error: any) => {
            this.inProgressSpinnerService.progressSpinnerStatus(false);
            if (error.status === 403) {
              this.toastService.shortToastError('Tài khoản hoặc Mật khẩu không đúng', 'Lỗi đăng nhập');
            } else {
              this.toastService.shortToastError('Đã xảy ra lỗi không xác định', 'Lỗi đăng nhập');
            }
          },
          complete: () => {
            this.inProgressSpinnerService.progressSpinnerStatus(false);
          }
        })
      );
    }
  }

  async socialAuthentication(provider: 'google' | 'facebook') {
    try {
      const token: TToken = await this.socialAuthenticationService.authentication(provider);
      this.authService.afterLogin(token);
      this.closeModal.emit(token);
    } catch (error: any) {
      if (error.message === 'auth/invalid-email') {
        this.toastService.shortToastError('Không lấy được email', 'Lỗi xác thực');
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
