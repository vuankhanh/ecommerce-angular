import { Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Identification } from '../../../models/Identification';

import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { MainContainerScrollService } from '../../../services/main-container-scroll.service';

import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../sharing/module/material';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryPipe } from '../../../sharing/pipe/gallery.pipe';
import { ProductDetailEntity } from '../../../entity/product-detail.entity';
import { NumberInputComponent } from '../../../sharing/component/number-input/number-input.component';
import { CurrencyCustomPipe } from '../../../sharing/pipe/currency-custom.pipe';
import { CartItemEntity } from '../../../entity/cart.entity';
import { LangLocalePipe } from '../../../sharing/pipe/lang.pipe';
import { LangService } from '../../../services/lang.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SEOService } from '../../../services/seo.service';
import { MetaTagFacebook } from '../../../models/MetaTag';
import { PrefixBackendStaticPipe } from '../../../sharing/pipe/prefix-backend.pipe';

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
export class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private readonly cartService: CartService = inject(CartService);
  public readonly authService: AuthService = inject(AuthService);
  private readonly mainContainerScrollService: MainContainerScrollService = inject(MainContainerScrollService);
  private readonly langService: LangService = inject(LangService);
  private readonly langLocalePipe: LangLocalePipe = inject(LangLocalePipe);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly seoSerivce: SEOService = inject(SEOService);
  private readonly prefixBackendStaticPipe: PrefixBackendStaticPipe = inject(PrefixBackendStaticPipe);

  @ViewChild('listImg') listImg?: ElementRef;
  @ViewChild('mainContainer') mainContainer?: ElementRef;
  currentLang = 'vi';
  sanitizedFacebookUrl!: SafeResourceUrl;
  scrollBottom$ = this.mainContainerScrollService.listenScrollBottom$;
  isBrowser: boolean = isPlatformBrowser(this.platformId);

  product: ProductDetailEntity | null = null;

  identification?: Identification;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.data.subscribe({
        next: (data) => {
          const { product } = data;
          this.product = product as ProductDetailEntity;

          const metaTagFacebook: MetaTagFacebook = {
            title: this.product.name,
            image: this.prefixBackendStaticPipe.transform(this.product.album?.media[0]?.url ?? ''),
            imageAlt: this.product.name,
            imageType: 'image/webp',
            imageWidth: '1045',
            imageHeight: '587',
            url: this.router.url,
            description: this.product.shortDescription,

            productBrand: 'Bếp Tứ Thân',
            productAvailability: this.product.inStock ? 'in stock' : 'out of stock',
            productCondition: 'new',
            productPriceAmount: this.product.price.toString(),
            productPriceCurrency: 'VND',
            productRetailerItemId: this.product._id,
            productItemGroupId: this.product._id,
            googleProductCategory: this.product.productCategory?.name ?? '',
          }

          this.seoSerivce.updateMetaTagFacebook(metaTagFacebook);
        }, error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log('Product detail resolver completed');
        }
      })
    )
    this.currentLang = this.langService.getCurrentLang();
    this.updateFacebookUrl();
  }

  private updateFacebookUrl() {
    const locale = this.currentLang ? this.langLocalePipe.transform(this.currentLang, 'locale') : 'vi_VN';
    const url = `https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fbep.4.than&width=450&layout&action&size&share=true&height=35&appId&locale=${locale}`;
    // Security Hotspot Reviewed:
    // - The URL is fully static and only locale is appended from a controlled enum.
    // - No user input or external data is used.
    // - Required for Facebook iframe plugin integration.
    // - Angular built-in sanitization is disabled here, but context is safe.
    this.sanitizedFacebookUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  bookNow(product: ProductDetailEntity) {
    const cartItem = new CartItemEntity(product);
    this.cartService.addToCart(cartItem)
    this.router.navigate(['/gio-hang']);
  }

  addToCart(product: ProductDetailEntity) {
    const cartItem = new CartItemEntity(product);
    this.cartService.addToCart(cartItem)
  }

  // contactUs(type: 'messenger' | 'zalo' | 'call') { }

  login() {
    this.authService.login('login');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
