import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Identification } from '../../../models/Identification';

import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { SEOService } from '../../../services/seo.service';
import { InProgressSpinnerService } from '../../../services/in-progress-spinner.service';
import { MainContainerScrollService } from '../../../services/main-container-scroll.service';

import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../sharing/module/material';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryPipe } from '../../../sharing/pipe/gallery.pipe';
import { ProductService } from '../../../services/api/product.service';
import { ProductDetailEntity } from '../../../entity/product-detail.entity';
import { NumberInputComponent } from '../../../sharing/component/number-input/number-input.component';
import { CurrencyCustomPipe } from '../../../sharing/pipe/currency-custom.pipe';
import { CartItemEntity } from '../../../entity/cart.entity';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,

    NumberInputComponent,
    GalleryPipe,
    CurrencyCustomPipe,

    YouTubePlayerModule,

    GalleryComponent,

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
