import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { animationSlide } from '../../animation/slide-show';

import { Product } from '../../models/Product';

import { CartService } from '../../services/cart.service';
import { HeaderService } from '../../services/header.service';
import { AppServicesService } from '../../services/app-services.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GalleryRoutePipe } from '../../pipes/gallery-route.pipe';

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [
    CommonModule,

    GalleryRoutePipe,

    CarouselModule
  ],
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss'],
  animations: [animationSlide]
})
export class SlideShowComponent implements OnInit, OnDestroy {
  productHightlights: Array<Product> = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private cartService: CartService,
    private headerService: HeaderService,
    private appServicesService: AppServicesService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.appServicesService.productHightlight$.subscribe(res => {
        if (res.length) {
          this.productHightlights = res;
        }
      })
    )
  }

  showDetail(product: Product) {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
