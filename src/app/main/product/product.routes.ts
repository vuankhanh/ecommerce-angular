import { Routes } from "@angular/router";
import { ProductComponent } from "./product.component";
import { productCategoryResolver } from "../../sharing/core/resolvers/product-category.resolver";
import { redirectToFirstProductCategoryGuard } from "../../sharing/core/guards/redirect-to-first-product-category.guard";

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    resolve: {
      productCategories: productCategoryResolver
    },
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