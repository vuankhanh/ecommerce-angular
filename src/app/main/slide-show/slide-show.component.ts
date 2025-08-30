import { Component, inject } from '@angular/core';

import { animationSlide } from '../../animation/slide-show';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { CommonModule } from '@angular/common';
import { SlideShowService } from '../../services/api/slide-show.service';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';

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
export class SlideShowComponent {
  private readonly slideShowService: SlideShowService = inject(SlideShowService);
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
}
