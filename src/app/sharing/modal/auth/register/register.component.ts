import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Validation Form
import { tiengVietKhongDau, safePassword, isSameInConfirmPassword } from '../../../validator/validators'

//Service
import { RegisterService } from '../../../../services/api/register.service';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../module/material';
import { CheckExistsAccountService } from '../../../../services/api/check-exists-account.service';
import { ToastService } from '../../../../services/toast.service';
import { CapsLockDirective } from '../../../directive/caps-lock.directive';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    CapsLockDirective,

    MaterialModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly checkExistsAccountService: CheckExistsAccountService = inject(CheckExistsAccountService);
  private readonly registerService: RegisterService = inject(RegisterService);
  private readonly toastService: ToastService = inject(ToastService);

  @Output() valueChange = new EventEmitter();
  registerGroup!: FormGroup;
  fieldTextType = false;
  repeatFieldTextType = false;
  capsOn: any;
  loading = false;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneNumberRegEx = /((0)+([0-9]{9})\b)/g;
    this.registerGroup = this.formBuilder.group({
      userName: ['', { validators: [Validators.required, tiengVietKhongDau()], updateOn: 'blur' }],
      password: ['', { validators: [Validators.required, safePassword()], updateOn: 'blur' }],
      confirmPassword: ['', { validators: [Validators.required, isSameInConfirmPassword()], updateOn: 'blur' }],
      name: ['', Validators.required],
      email: ['', { validators: [Validators.required, Validators.pattern(emailRegEx)], updateOn: 'blur' }],
      phoneNumber: ['', { validators: [Validators.required, Validators.pattern(phoneNumberRegEx)], updateOn: 'blur' }],
    });
  }

  checkExistsUserName() {
    const userName = this.registerGroup.controls['userName'];
    if (userName.valid) {
      this.subscription.add(
        this.checkExistsAccountService.checkExistUserName({ userName: userName.value }).subscribe({
          next: () => {
            if (userName.errors) {
              delete userName.errors!['isAlreadyExist'];
            }
          }, error: (error) => {
            if (error.status === 409) {
              userName.setErrors({ isAlreadyExist: true });
            }
          }
        })
      )
    }
  }

  checkExistsEmail() {
    const email = this.registerGroup.controls['email'];
    if (email.valid) {
      this.subscription.add(
        this.checkExistsAccountService.checkExistEmail({ email: email.value }).subscribe({
          next: () => {
            if (email.errors) {
              delete email.errors!['isAlreadyExist'];
            }
          }, error: (err) => {
            if (err.status === 409) {
              email.setErrors({ isAlreadyExist: true });
            }
          }
        })
      )
    }
  }

  //Show Match Password is done
  passwordValid() {
    return this.registerGroup.controls['password'].valid && this.registerGroup.controls['confirmPassword'].valid;
  }

  register() {
    const email = this.registerGroup.controls['email'];
    const userName = this.registerGroup.controls['userName'];
    if (this.registerGroup.valid) {
      this.loading = true;
      this.subscription.add(
        this.registerService.register(this.registerGroup.value).subscribe({
          next: () => {
            this.loading = false;
            this.toastService.shortToastSuccess('Bạn đã đăng ký thành công.', 'Thành Công');
            this.valueChange.emit('registerSuccessful');
          }, error: (error) => {
            if (error.status === 409) {
              if (error.error.key) {
                if (error.error.key.userName) {
                  userName.setErrors({ isAlreadyExist: true });
                }

                if (error.error.key.email) {
                  email.setErrors({ isAlreadyExist: true });
                }
              }
              this.loading = false;
            }
          }
        })
      )
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
