import { Component, Inject, OnInit, Optional } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../module/material';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterSuccessfulComponent } from './register-successful/register-successful.component';
import { ForgotPasswordSuccessfulComponent } from './forgot-password-successful/forgot-password-successful.component';
import { TToken } from '../../../models/token.interface';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RegisterSuccessfulComponent,
    ForgotPasswordSuccessfulComponent,

    MaterialModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  historyModalComponent: Array<'login' | 'register' | 'forgotPassword' | 'registerSuccessful' | 'forgotPasswordSuccessful'> = [];
  constructor(
    @Optional() public bottomSheetRef: MatBottomSheetRef<AuthComponent>,
    @Optional() public dialogRef: MatDialogRef<AuthComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) @Optional() public data: TypeLogin,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: TypeLogin
  ) {
    this.data = data || dialogData;
  }

  ngOnInit(): void {
    this.historyModalComponent.push(this.data.type);
  }

  changeComponent(event: any) {
    if (event === 'login' || event === 'registerSuccessful' || event === 'forgotPasswordSuccessful') {
      this.historyModalComponent = [];
      this.historyModalComponent.push(event);
    } else {
      this.historyModalComponent.push(event);
    }
    this.data.type = event;
  }

  back() {
    if (this.historyModalComponent.length > 1) {
      this.historyModalComponent.pop();
      this.data.type = this.historyModalComponent[this.historyModalComponent.length - 1];
    }
  }

  closeModal(value?: TToken) {
    if (this.bottomSheetRef) this.bottomSheetRef.dismiss(value);
    if (this.dialogRef) this.dialogRef.close(value);
  }

}

export interface TypeLogin {
  type: 'login' | 'register' | 'forgotPassword' | 'registerSuccessful' | 'forgotPasswordSuccessful';
};
