import { inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../../models/Product';
import { ProductService } from '../../../services/api/product/product.service';

export const productDetailResolver: ResolveFn<Product> =
  (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> => {
    const productService = inject(ProductService);
    const productRoute = route.paramMap.get('route') || '';
    return productService.getProductRoute(productRoute);
  };
