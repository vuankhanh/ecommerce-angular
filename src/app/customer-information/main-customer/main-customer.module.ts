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
import { ReplaceProtocolNamePipe } from '../../pipes/replace-protocol-name/replace-protocol-name.pipe';
import { ReplaceSpacePipe } from '../../pipes/replace-space/replace-space.pipe';
import { GalleryRoutePipe } from '../../pipes/gallery-route/gallery-route.pipe';
import { SanitizeHtmlBindingPipe } from '../../pipes/sanitize-html-binding/sanitize-html-binding.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainCustomerRoutingModule,

    MaterialModule,

    ReplaceProtocolNamePipe,
    ReplaceSpacePipe,
    GalleryRoutePipe,
    SanitizeHtmlBindingPipe,
  ],
  declarations: [
    MainCustomerComponent,
    PersonalInformationComponent,
    ChangePasswordComponent,
    AddressBookComponent,
    OrderHistoryComponent,

    AddressModifyComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    }
  ]
})
export class MainCustomerModule { }