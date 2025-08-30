import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';

import { IBreadcrumb } from '../models/breadcrumb.interface';

import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProductDetailEntity } from '../entity/product-detail.entity';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly router: Router = inject(Router);
  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {
    this.router.events.pipe(
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
        // Construct the breadcrumb hierarchy
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: IBreadcrumb[] = [];
        this.addBreadcrumb(root, [], breadcrumbs);
    
        // Emit the new hierarchy
        this._breadcrumbs$.next(breadcrumbs);
    });
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: IBreadcrumb[]) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));

      // Add an element for the current route part
      if(route.data['breadcrumb']) {
        //Nếu là chi tiết sản phẩm, lấy tên sản phẩm từ data và thêm danh mục sản phẩm vào trước sản phẩm
        if(route.routeConfig?.path === ':productSlug'){
          if(route.data['product']){
            const product: ProductDetailEntity = route.data['product'];
            const newRouteUrl = routeUrl;
            newRouteUrl.splice(-1);
            const breadcrumb = {
              label: product.productCategory!.name,
              url: '/' + newRouteUrl.join('/')
            };
            breadcrumbs.push(breadcrumb);
          }
        }
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/')
        };
        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild!, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb'];
  }

}
