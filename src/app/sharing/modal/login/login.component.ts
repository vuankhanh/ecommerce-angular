import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Service

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/api/login.service';
import { ToastService } from '../../../services/toast.service';
import { SocialAuthenticationService } from '../../../services/api/social-login/social-authentication';
import { InProgressSpinnerService } from '../../../services/in-progress-spinner.service';
import { MaterialModule } from '../../module/material';
import { TToken } from '../../../models/token.interface';
import { AuthService } from '../../../services/auth.service';
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
  @Output() valueChange = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  loginGroup!: FormGroup;
  fieldTextType: boolean = false;

  private subscription: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private socialAuthenticationService: SocialAuthenticationService,
    private toastService: ToastService,
    private inProgressSpinnerService: InProgressSpinnerService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){
    this.loginGroup = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    if(this.loginGroup.valid){
      this.inProgressSpinnerService.progressSpinnerStatus(true);
      this.subscription.add(
        this.loginService.login(this.loginGroup.value).subscribe(res=>{
          this.inProgressSpinnerService.progressSpinnerStatus(false);
          
          if(res.status===205){
            this.toastService.shortToastWarning('Tài khoản chưa kích hoạt', 'Đăng nhập');
          }else if(res.status === 200){
            this.closeModal.emit(res.body);
            this.toastService.shortToastSuccess('Đăng nhập thành công', '');
          }
        },error=>{
          
          this.inProgressSpinnerService.progressSpinnerStatus(false);
          if(error.status === 403){
            this.toastService.shortToastError('Tài khoản hoặc Mật khẩu không đúng', 'Lỗi đăng nhập');
          }else{
            this.toastService.shortToastError('Đã xảy ra lỗi không xác định', 'Lỗi đăng nhập');
          }
        })
      );
    }
  }

  async socialAuthentication(provider: 'google' | 'facebook'){
      try {
        const token: TToken = await this.socialAuthenticationService.authentication(provider);
        this.authService.afterLogin(token);
      } catch (error) {
        
      }
    }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
