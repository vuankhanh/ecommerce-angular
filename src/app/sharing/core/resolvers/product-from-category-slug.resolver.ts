import { ResolveFn } from '@angular/router';
import { TProductModel } from '../../../models/product.interface';
import { inject } from '@angular/core';
import { ProductService } from '../../../services/api/product.service';
import { catchError, Observable, of } from 'rxjs';

export const productFromCategorySlugResolver: ResolveFn<Observable<TProductModel[]| null>> = (route, state) => {
  const productService = inject(ProductService);
  const productCategorySlug = route.paramMap.get('productCategory') as string;
  if (!productCategorySlug) {
    return of(null);
  }
  return productService.getAllDataByCategorySlug(productCategorySlug).pipe(
    catchError(_=> of(null)) // trả về null nếu lỗi
  );
};
