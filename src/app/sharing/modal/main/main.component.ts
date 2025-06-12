import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ResponseLogin } from '../../../services/api/login.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../module/material';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { RegisterSuccessfulComponent } from '../register-successful/register-successful.component';
import { ForgotPasswordSuccessfulComponent } from '../forgot-password-successful/forgot-password-successful.component';
@Component({
  selector: 'app-check-account-main',
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
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  historyModalComponent: Array<string> = [];
  constructor(
    public dialogRef: MatDialogRef<MainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TypeLogin
  ) { }

  ngOnInit(): void {
    this.historyModalComponent.push(this.data.type);
  }

  changeComponent(event: any){
    if(event === 'login' || event === 'registerSuccessful' || event === 'forgotPasswordSuccessful'){
      this.historyModalComponent = [];
      this.historyModalComponent.push(event);
    }else{
      this.historyModalComponent.push(event);
    }
    this.data.type = event;
  }

  back(){
    if(this.historyModalComponent.length>1){
      this.historyModalComponent.pop();
      this.data.type = this.historyModalComponent[this.historyModalComponent.length-1];
    }
  }

  closeModal(value: ResponseLogin){
    this.dialogRef.close(value);
  }

}

export interface TypeLogin{
  type: string
}
