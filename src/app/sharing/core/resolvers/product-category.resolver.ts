import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductCategoryService } from '../../../services/api/product-category.service';
import { catchError, Observable, of } from 'rxjs';
import { TProductCategoryModel } from '../../../models/product-category.interface';

export const productCategoryResolver: ResolveFn<Observable<TProductCategoryModel | null>> = (route, state) => {
  const productCategoryService = inject(ProductCategoryService);
  const productCategorySlug = route.paramMap.get('productCategory') as string;
  if (!productCategorySlug) {
    return of(null);
  }
  return productCategoryService.getDetail(productCategorySlug).pipe(
    catchError(_ => of(null)) // trả về null nếu lỗi
  );
};
