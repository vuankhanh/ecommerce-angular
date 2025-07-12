import { Routes } from "@angular/router";
import { ProductComponent } from "./product.component";

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: ':productCategory',
        title: 'Danh mục sản phẩm',
        loadComponent: () => import('./product-category/product-category.component').then(m => m.ProductCategoryComponent)
      },
      {
        path: ':productCategory/:productSlug',
        title: 'Chi tiết sản phẩm',
        loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      }
    ]
  }
]