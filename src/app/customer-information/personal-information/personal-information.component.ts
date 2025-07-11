import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

//Model
import { UserInformation } from '../../models/UserInformation';

//Service

//Validation Form
import { tiengVietKhongDau, safePassword, isSameInConfirmPassword } from '../../services/formCustom/validators'

import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ResponseUpdate, UpdatePersonalInformationService } from '../../services/api/update-personal-information.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';
import { AppServicesService } from '../../services/app-services.service';
import { TToken } from '../../models/token.interface';
import { LocalStorageKey } from '../../sharing/constant/local_storage.constant';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    CommonModule,

    MaterialModule
  ],
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  screenWidthSize: 'full' | 'normal' | 'mini' = 'normal';
  informationGroup!: FormGroup;
  checkedChangePassword: boolean = false;
  private emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private phoneNumberRegEx = /((0)+([0-9]{9})\b)/g;
  private subscription: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private updatePersonalInformationService: UpdatePersonalInformationService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private appServiceService: AppServicesService
  ) { }

  ngOnInit(): void {
    this.listenUserInformation();
    this.checkDevice();
  }

  listenUserInformation(){
    this.subscription.add(
      this.authService.jwtPayload$.subscribe(userInfo=>{
        // this.formInit(userInfo);
        // this.setDisablePasswordControls(this.checkedChangePassword);
      })
    );
  }

  checkDevice(){
    this.subscription.add(
      this.appServiceService.checkScreenWidthSize$.subscribe(res=>{
        this.screenWidthSize = res;
      })
    )
  }

  formInit(userInformation: UserInformation | null){
    if(userInformation){
      
      this.informationGroup = this.formBuilder.group({
        name: [userInformation?.name, Validators.required],
        email: [
          {
            value: userInformation?.email,
            disabled: true
          },
          {
            validators: [Validators.required, Validators.pattern(this.emailRegEx)],
            updateOn: 'blur'
          }
        ],
        phoneNumber: [userInformation?.phoneNumber, { validators: [Validators.required, , Validators.pattern(this.phoneNumberRegEx)], updateOn: 'blur' }],
        oldPassword: ['', Validators.required],
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
      });
    }
  }

  changePassword(event: MatCheckboxChange){
    this.checkedChangePassword = event.checked;
    this.setDisablePasswordControls(this.checkedChangePassword);
  }

  setDisablePasswordControls(checkedChangePassword: boolean){
    if(!checkedChangePassword){
      this.informationGroup.controls['oldPassword'].disable();
      this.informationGroup.controls['password'].disable();
      this.informationGroup.controls['confirmPassword'].disable();
    }else{
      this.informationGroup.controls['oldPassword'].enable();
      this.informationGroup.controls['password'].enable();
      this.informationGroup.controls['confirmPassword'].enable();
    }
  }

  update(){
    if(this.informationGroup.valid){
      this.informationGroup.controls['confirmPassword'].disable();
      let tokenStoraged: TToken = <TToken>this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
      if(tokenStoraged){
        this.updatePersonalInformationService.update(tokenStoraged.accessToken, this.informationGroup.value).subscribe(res=>{
          this.informationGroup.controls['confirmPassword'].enable();
          this.informationGroup.controls['oldPassword'].setErrors(null);
          if(res.status === 200){
            let resBody: ResponseUpdate = <ResponseUpdate>res.body;
            if(resBody.accessToken){
              this.authService.updateAccessToken(resBody.accessToken);
              this.toastService.shortToastSuccess('Đã cập nhật thành công', 'Thành công');
              this.checkedChangePassword = false;
            }
          }
          // else if(res.status){
          //   this.toastService.shortToastWarning('Không có gì thay đổi', '');
          // }
        },error=>{
          this.informationGroup.controls['confirmPassword'].enable();
          if(error.status === 400){
            this.informationGroup.controls['oldPassword'].setErrors({ passwordIsIncorrect: true });
          }else{
            this.toastService.shortToastError('Đã có lỗi xảy ra', '');
          }
        })
      }
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
