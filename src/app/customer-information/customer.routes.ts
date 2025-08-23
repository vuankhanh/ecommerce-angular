import { Routes } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderHistoryDetailComponent } from './order-history-detail/order-history-detail.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      { path: '', redirectTo: 'personal', pathMatch: 'full' },
      { path: 'personal', component: PersonalInformationComponent, data: { title: $localize`:@@route.customer.personal.title:Thông tin cá nhân` } },
      { path: 'order-history', component: OrderHistoryComponent, data: { title: $localize`:@@route.customer.order-history.title:Lịch sử mua hàng` } },
      { path: 'order-history/:id', component: OrderHistoryDetailComponent, data: { title: $localize`:@@route.customer.order-history.title:Lịch sử mua hàng` } },
      { path: 'address-book', component: AddressBookComponent, data: { title: $localize`:@@route.customer.address-book.title:Sổ địa chỉ` } },
      { path: 'chat', component: ChatComponent, data: { title:  $localize`:@@route.customer.chat.title:Lời nhắn` } }
    ]
  },
];
