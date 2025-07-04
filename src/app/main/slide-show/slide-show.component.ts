import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { animationSlide } from '../../animation/slide-show';

import { CartService } from '../../services/cart.service';
import { HeaderService } from '../../services/header.service';
import { AppServicesService } from '../../services/app-services.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SlideShowService } from '../../services/api/slide-show.service';
import { PrefixBackendStaticPipe } from '../../pipes/prefix-backend.pipe';

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,

    CarouselModule
  ],
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss'],
  animations: [animationSlide]
})
export class SlideShowComponent implements OnInit, OnDestroy {
  slideShow$ = this.slideShowService.get();

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    // mouseDrag: false,
    // touchDrag: false,
    // pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: true
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private cartService: CartService,
    private headerService: HeaderService,
    private appServicesService: AppServicesService,
    private readonly slideShowService: SlideShowService
  ) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
