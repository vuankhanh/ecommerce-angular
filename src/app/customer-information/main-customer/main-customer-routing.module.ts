import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainCustomerComponent } from './main-customer.component';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';
import { OrderHistoryComponent } from '../order-history/order-history.component';
import { OrderHistoryDetailComponent } from '../order-history-detail/order-history-detail.component';
import { AddressBookComponent } from '../address-book/address-book.component';
import { ChatComponent } from '../chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: MainCustomerComponent,
    children:[
      { path: '', redirectTo: 'personal', pathMatch: 'full'},
      { path: 'personal', component: PersonalInformationComponent, data: { title: 'Tài khoản của tôi' } },
      { path: 'order-history', component: OrderHistoryComponent, data: { title: 'Lịch sử mua hàng' } },
      { path: 'order-history/:id', component: OrderHistoryDetailComponent, data: { title: 'Lịch sử mua hàng' } },
      { path: 'address-book', component: AddressBookComponent, data: { title: 'Sổ địa chỉ' } },
      { path: 'chat', component: ChatComponent, data: { title: 'Lời nhắn' } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainCustomerRoutingModule { }
