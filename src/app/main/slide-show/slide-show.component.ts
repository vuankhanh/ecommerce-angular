import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { animationSlide } from '../../animation/slide-show';

import { Product } from 'src/app/models/Product';

import { CartService } from 'src/app/services/cart.service';
import { HeaderService } from 'src/app/services/header.service';
import { AppServicesService } from 'src/app/services/app-services.service';
// import Swiper core and required modules
import SwiperCore, { A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar, Swiper, SwiperOptions, Thumbs, Virtual, Zoom } from 'swiper';

import { Subscription } from 'rxjs';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);
@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss'],
  animations: [animationSlide]
})
export class SlideShowComponent implements OnInit, OnDestroy {
  productHightlights: Array<Product>;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 15,
    pagination: { clickable: true },
    autoplay: { delay: 3000, disableOnInteraction: false }
  };
  
  private subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private cartService: CartService,
    private headerService: HeaderService,
    private appServicesService: AppServicesService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.appServicesService.productHightlight$.subscribe(res=>{
        if(res.length){
          this.productHightlights = res;
        }
      })
    )
  }

  onSwiper(swiper: any) {
    
  }

  onSlideChange(event: any) {
    let e: Swiper = event;
  }

  addToCart(product: Product): void{
    this.cartService.addToCart(product, true);
    this.headerService.set(true);
  }

  showDetail(product: Product): void{
    this.router.navigate(['san-pham/'+product.category.route, product.route]);
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
