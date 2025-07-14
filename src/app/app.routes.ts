import { Routes } from '@angular/router';
import { HomePageComponent } from './main/home-page/home-page.component';
import { CartComponent } from './main/cart/cart.component';
import { PaymentPageComponent } from './main/payment-page/payment-page.component';
import { permissionGuard } from './sharing/core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Trang chủ',
    data: {
      breadcrumb: 'Trang chủ'
    }
  }, {
    path: 'san-pham',
    loadChildren: () => import('./main/product/product.routes').then(m => m.routes)
  }, {
    path: 'gio-hang',
    component: CartComponent,
    title: 'Giỏ hàng',
    data: {
      breadcrumb: 'Giỏ hàng'
    }
  }, {
    path: 'thanh-toan',
    component: PaymentPageComponent,
    title: 'Thanh toán',
    data: {
      breadcrumb: 'Thanh toán'
    }
  },
  {
    path: 'khach-hang',
    loadChildren: () => import('./customer-information/customer.routes').then(m => m.routes),
    canActivate: [permissionGuard]
  }
];
