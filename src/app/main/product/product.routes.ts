import { Routes } from "@angular/router";
import { ProductComponent } from "./product.component";
import { productDetailResolver } from "../../sharing/core/resolvers/product-detail.resolver";
import { productCategoryResolver } from "../../sharing/core/resolvers/product-category.resolver";
import { productFromCategorySlugResolver } from "../../sharing/core/resolvers/product-from-category-slug.resolver";

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    title: 'Sản phẩm',
    data: {
      breadcrumb: 'Sản phẩm'
    },
    children: [
      {
        path: ':productCategory',
        title: 'Danh mục sản phẩm',
        loadComponent: () => import('./product-category/product-category.component').then(m => m.ProductCategoryComponent),
        resolve: {
          productCategory: productCategoryResolver,
          productFromCategorySlug: productFromCategorySlugResolver
        },
        data: {
          breadcrumb: (data: any) => data.productCategory?.name || 'Danh mục sản phẩm'
        }
      },
      {
        path: ':productCategory/:productSlug',
        title: 'Chi tiết sản phẩm',
        loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        resolve: {
          product: productDetailResolver
        },
        data: {
          breadcrumb: (data: any)=>{
            return data.product?.name || 'Chi tiết sản phẩm'
          }
        }
      }
    ]
  }
]