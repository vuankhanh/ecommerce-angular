import { Routes } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderHistoryDetailComponent } from './order-history-detail/order-history-detail.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { ChatComponent } from './chat/chat.component';
import { AddressBookFormComponent } from './address-book-form/address-book-form.component';

export const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      { path: '', redirectTo: 'personal', pathMatch: 'full' },
      { path: 'personal', component: PersonalInformationComponent, data: { title: 'Tài khoản của tôi' } },
      // { path: 'order-history', component: OrderHistoryComponent, data: { title: 'Lịch sử mua hàng' } },
      // { path: 'order-history/:id', component: OrderHistoryDetailComponent, data: { title: 'Lịch sử mua hàng' } },
      { path: 'address-book', component: AddressBookComponent, data: { title: 'Sổ địa chỉ' } },
      { path: 'address-book/create', component: AddressBookFormComponent },
      { path: 'address-book/edit/:id', component: AddressBookFormComponent },
      { path: 'chat', component: ChatComponent, data: { title: 'Lời nhắn' } }
    ]
  },
];
