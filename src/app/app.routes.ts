import { Routes } from '@angular/router';
import { HomePageComponent } from './main/home-page/home-page.component';
import { CartComponent } from './main/cart/cart.component';
import { ProductionsComponent } from './main/product/product.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  }, {
    path: 'gio-hang',
    component: CartComponent
  }, {
    path: 'san-pham',
    component: ProductionsComponent
  }
];
