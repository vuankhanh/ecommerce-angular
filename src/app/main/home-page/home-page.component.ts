import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { SlideShowComponent } from '../slide-show/slide-show.component';
import { ProductCategoryHomePageComponent } from '../product-category-home-page/product-category-home-page.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductCategoryService } from '../../services/api/product-category.service';
import { TProductCategoryModel } from '../../models/product-category.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,

    RouterLink,
    SlideShowComponent,
    ProductCategoryHomePageComponent,

    MatIconModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  private readonly productCategoryService: ProductCategoryService = inject(ProductCategoryService);
  productCategory$: Observable<TProductCategoryModel[]> = this.productCategoryService.getAllData();
}
