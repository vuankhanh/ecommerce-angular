import { inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';

import { Observable } from 'rxjs';
import { ProductCategoryService } from '../../../services/api/product-category.service';
import { TProductCategoryModel } from '../../../models/product-category.interface';

export const productCategoryResolver: ResolveFn<TProductCategoryModel[]> =
  (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TProductCategoryModel[]> => {
    const productCategoryService = inject(ProductCategoryService);
    return productCategoryService.getAllData();
  };
