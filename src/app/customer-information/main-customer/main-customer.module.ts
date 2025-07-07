import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainCustomerRoutingModule } from './main-customer-routing.module';

//PipeModule

import { MainCustomerComponent } from '../main-customer/main-customer.component';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AddressBookComponent } from '../address-book/address-book.component';
import { OrderHistoryComponent } from '../order-history/order-history.component';

//Component
import { AddressModifyComponent } from '../../sharing/modal/address-modify/address-modify.component';

import { RefreshTokenInterceptorService } from '../../services/api/refresh-token-interceptor.service';
import { MaterialModule } from '../../sharing/module/material';
import { ReplaceProtocolNamePipe } from '../../sharing/pipe/replace-protocol-name.pipe';
import { ReplaceSpacePipe } from '../../sharing/pipe/replace-space.pipe';
import { GalleryRoutePipe } from '../../sharing/pipe/gallery-route.pipe';
import { SanitizeHtmlBindingPipe } from '../../sharing/pipe/sanitize-html-binding.pipe';

@NgModule({
  imports: [
    
  ],
  declarations: [
    
  ],
  providers: [
    
  ]
})
export class MainCustomerModule { }