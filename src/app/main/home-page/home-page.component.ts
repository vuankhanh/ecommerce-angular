import { AfterViewInit, Component, OnInit } from '@angular/core';

import { ProductCategory } from '../../models/ProductCategory';

import { AppServicesService } from '../../services/app-services.service';

import { Observable } from 'rxjs';
import { SlideShowComponent } from '../slide-show/slide-show.component';
import { ProductCategoryHomePageComponent } from '../product-category-home-page/product-category-home-page.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,

    RouterLink,
    // SlideShowComponent,
    ProductCategoryHomePageComponent,

    MatIconModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  category$: Observable<ProductCategory[]>;
  constructor(
    private appServiceService: AppServicesService
  ) {
    this.category$ = this.appServiceService.productCategory$;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }
}
