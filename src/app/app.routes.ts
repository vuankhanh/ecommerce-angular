import { Routes } from '@angular/router';
import { HomePageComponent } from './main/home-page/home-page.component';
import { CartComponent } from './main/cart/cart.component';
import { PaymentPageComponent } from './main/payment-page/payment-page.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/api/refresh-token-interceptor.service';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  }, {
    path: 'san-pham',
    loadChildren: () => import('./main/product/product.routes').then(m => m.routes)
  }, {
    path: 'gio-hang',
    component: CartComponent
  }, {
    path: 'thanh-toan',
    component: PaymentPageComponent
  },
  {
    path: 'khach-hang',
    loadChildren: () => import('./customer-information/customer.routes').then(m => m.routes),
    providers: [
      provideHttpClient(
        withInterceptors([authInterceptor])
      ),
    ]
  }
];
