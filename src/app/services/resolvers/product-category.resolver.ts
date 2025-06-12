import { inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';

import { ProductCategory } from '../../models/ProductCategory';

import { AppServicesService } from '../app-services.service';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export const productCategoryResolver: ResolveFn<ProductCategory | null> =
  (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProductCategory | null> => {
    const appServicesService = inject(AppServicesService);
    const category = route.paramMap.get('category');

    return appServicesService.productCategory$.pipe(
      filter(productCategories => productCategories.length > 0),
      map(productCategories => productCategories.find(c => c.route === category) || null),
      take(1)
    );
  };
