import { Component, OnInit, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../module/material';
import { ResetPasswordService } from '../../../../services/api/reset-password.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly resetPasswordService: ResetPasswordService = inject(ResetPasswordService);
  private readonly toastService: ToastService = inject(ToastService);
  @Output() valueChange = new EventEmitter();

  forgotPasswordForm!: FormGroup;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', { validators: [Validators.required, Validators.pattern(emailRegEx)], updateOn: 'blur' }]
    })
  }

  checkEmail() {
    if (this.forgotPasswordForm.valid) {
      this.subscription.add(
        this.resetPasswordService.checkEmail(this.forgotPasswordForm.value.email).subscribe({
          next: () => {
            this.valueChange.emit('forgotPasswordSuccessful');
          }, error: () => {
            this.toastService.shortToastError('Email không hợp lệ', '');
          }
        })
      )
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
