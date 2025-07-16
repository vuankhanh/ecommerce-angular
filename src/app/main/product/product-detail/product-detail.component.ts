import { AfterViewInit, Component, ElementRef, Inject, isDevMode, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// import { AddressChooseComponent } from '../../../sharing/modal/address-choose/address-choose.component';
// import { WriteRatingComponent } from '../../../sharing/modal/write-rating/write-rating.component';
// import { ThanksForTheReviewComponent } from '../../../sharing/modal/thanks-for-the-review/thanks-for-the-review.component';

//Pipe

import { Identification } from '../../../models/Identification';

import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { SEOService } from '../../../services/seo.service';
import { InProgressSpinnerService } from '../../../services/in-progress-spinner.service';
import { MainContainerScrollService } from '../../../services/main-container-scroll.service';

import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { MaterialModule } from '../../../sharing/module/material';
import { TheDayOfWeekPipe } from '../../../sharing/pipe/the-day-of-week-format.pipe';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PostsComponent } from '../../../sharing/component/posts/posts.component';
import { RatingComponent } from '../../../sharing/component/rating/rating.component';
import { ProductCategoryHomePageComponent } from '../../product-category-home-page/product-category-home-page.component';
import { PrefixBackendStaticPipe } from '../../../sharing/pipe/prefix-backend.pipe';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryPipe } from '../../../sharing/pipe/gallery.pipe';
import { ProductService } from '../../../services/api/product.service';
import { ProductDetailEntity } from '../../../entity/product-detail.entity';
import { NumberInputComponent } from '../../../sharing/component/number-input/number-input.component';
import { SkeletonComponent } from '../../../sharing/component/skeleton/skeleton.component';
import { CurrencyCustomPipe } from '../../../sharing/pipe/currency-custom.pipe';
import { CartItemEntity } from '../../../entity/cart.entity';
import { error } from 'console';

const headerOffset = 85;
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,

    NumberInputComponent,
    GalleryPipe,
    TheDayOfWeekPipe,
    CurrencyCustomPipe,

    YouTubePlayerModule,

    GalleryComponent,
    SkeletonComponent,
    PostsComponent,
    RatingComponent,
    ProductCategoryHomePageComponent,

    MaterialModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('listImg') listImg?: ElementRef;
  @ViewChild('mainContainer') mainContainer?: ElementRef;

  scrollBottom$ = this.mainContainerScrollService.listenScrollBottom$;
  isBrowser: boolean;

  product: ProductDetailEntity | null = null;

  identification?: Identification;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private seoService: SEOService,
    private inProgressSpinnerService: InProgressSpinnerService,
    private mainContainerScrollService: MainContainerScrollService,
    private productService: ProductService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      const { product } = data;
      this.product = product;
    });

  }

  ngAfterViewInit() {

  }

  // openThanksForTheReview(productReviews: ProductReviews) {
  //   this.dialog.open(ThanksForTheReviewComponent, {
  //     panelClass: 'thanks-for-the-review-component',
  //     data: productReviews
  //   })
  // }

  bookNow(product: ProductDetailEntity) {
    const cartItem = new CartItemEntity(product);
    this.cartService.addToCart(cartItem)
    this.router.navigate(['/gio-hang']);
  }

  addToCart(product: ProductDetailEntity) {
    const cartItem = new CartItemEntity(product);
    this.cartService.addToCart(cartItem)
  }

  contactUs(type: 'messenger' | 'zalo' | 'call') { }

  login() {
    this.authService.login('login');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
