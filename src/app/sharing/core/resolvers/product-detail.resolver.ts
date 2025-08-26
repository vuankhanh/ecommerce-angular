import { inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ProductService } from '../../../services/api/product.service';
import { ProductDetailEntity } from '../../../entity/product-detail.entity';

export const productDetailResolver: ResolveFn<ProductDetailEntity | null> =
  (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProductDetailEntity | null> => {
    const productService = inject(ProductService);
    const productSlug = route.paramMap.get('productSlug') as string;
    if(!productSlug) {
      return of(null);
    }
    return productService.getDetail(undefined, productSlug).pipe(
      catchError(_=> of(null)) // trả về null nếu lỗi
    );
  };
