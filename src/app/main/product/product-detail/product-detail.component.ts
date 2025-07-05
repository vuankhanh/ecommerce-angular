import { AfterViewInit, Component, ElementRef, Inject, isDevMode, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// import { AddressChooseComponent } from '../../../sharing/modal/address-choose/address-choose.component';
// import { WriteRatingComponent } from '../../../sharing/modal/write-rating/write-rating.component';
// import { ThanksForTheReviewComponent } from '../../../sharing/modal/thanks-for-the-review/thanks-for-the-review.component';

//Pipe

import { Product } from '../../../models/Product';
import { Media } from '../../../models/ProductGallery';
import { UserInformation } from '../../../models/UserInformation';
import { Address } from '../../../models/Address';
import { MetaTagFacebook } from '../../../models/MetaTag';
import { Identification } from '../../../models/Identification';
import { Rating } from '../../../models/ServerConfig';
import { ProductReviews } from '../../../models/ProductReviews';
import { PaginationParams } from '../../../models/PaginationParams';

import { Cart, CartService } from '../../../services/cart.service';
import { ProductReviewsResponse, ProductReviewsService, TotalProductReviews } from '../../../services/api/product/product-reviews.service';
import { AuthService } from '../../../services/auth.service';
import { AddressModificationService } from '../../../services/address-modification.service';
import { ResponseAddress } from '../../../services/api/customer-address.service';
import { LocalStorageService } from '../../../services/local-storage.service';
// import { SocketIoService } from '../../../services/socket/socket-io.service';
import { SEOService } from '../../../services/seo.service';
import { InProgressSpinnerService } from '../../../services/in-progress-spinner.service';
import { ConfigService } from '../../../services/api/config.service';
import { MainContainerScrollService } from '../../../services/main-container-scroll.service';

import { Subject, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { MaterialModule } from '../../../sharing/module/material';
import { TheDayOfWeekPipe } from '../../../sharing/pipe/the-day-of-week-format.pipe';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PostsComponent } from '../../../sharing/component/posts/posts.component';
import { RatingComponent } from '../../../sharing/component/rating/rating.component';
import { PaginationComponent } from '../../../sharing/component/pagination/pagination.component';
import { ProductCategoryHomePageComponent } from '../../product-category-home-page/product-category-home-page.component';
import { PrefixBackendStaticPipe } from '../../../sharing/pipe/prefix-backend.pipe';
import { TProductModel } from '../../../models/product.interface';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryPipe } from '../../../sharing/pipe/gallery.pipe';
import { ProductService } from '../../../services/api/product.service';
import { ProductDetailEntity } from '../../../entity/product-detail.entity';
import { NumberInputComponent } from '../../../sharing/component/number-input/number-input.component';
import { SkeletonComponent } from '../../../sharing/component/skeleton/skeleton.component';
import { CurrencyCustomPipe } from '../../../sharing/pipe/currency-custom.pipe';

const headerOffset = 85;
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,

    PrefixBackendStaticPipe,
    NumberInputComponent,
    GalleryPipe,
    TheDayOfWeekPipe,
    CurrencyCustomPipe,

    YouTubePlayerModule,

    GalleryComponent,
    SkeletonComponent,
    PostsComponent,
    RatingComponent,
    PaginationComponent,
    ProductCategoryHomePageComponent,

    MaterialModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('listImg') listImg?: ElementRef;
  @ViewChild('mainContainer') mainContainer?: ElementRef;

  isBrowser: boolean;

  product?: ProductDetailEntity;
  cart?: Cart;


  identification?: Identification;
  rating: Array<Rating> = [];

  private readonly subscription: Subscription = new Subscription();
  scrollToBottomMainContainer: Subject<null> = new Subject<null>();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer2: Renderer2,
    private dialog: MatDialog,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
    private productReviewsService: ProductReviewsService,
    private cartService: CartService,
    private authService: AuthService,
    private addressModificationService: AddressModificationService,
    // private socketIoService: SocketIoService,
    private seoService: SEOService,
    private inProgressSpinnerService: InProgressSpinnerService,
    private configService: ConfigService,
    private mainContainerScrollService: MainContainerScrollService,
    private productService: ProductService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(params => params['productSlug'] as string),
      filter(productSlug => !!productSlug),
      switchMap(productSlug => {
        this.product = undefined;
        return this.productService.getDetail(undefined, productSlug);
      })
    ).subscribe({
      next: (product: ProductDetailEntity) => {
        this.product = product;
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err.message);
        // this.inProgressSpinnerService.hide();
      },
      complete: () => {
        console.log('Chi tiết sản phẩm đã được lấy thành công');
        
      }
    })
    const cartChange$ = this.cartService.listenCartChange();
    // const userInformation$ = this.authService.getUserInformation();
    // this.subscription.add(
    //   combineLatest(
    //     [
    //       userInformation$,
    //       cartChange$,
    //       activatedRouteData$
    //     ]
    //   ).subscribe(([userInfo, cart, productDetail]) => {

    //     if (userInfo) {
    //       this.userInformation = userInfo;
    //     }

    //     this.cart = cart;
    //     if (this.cart.deliverTo) {
    //       this.headquartersAddress = this.cart.deliverTo;
    //     }
    //     if (productDetail) {
    //       this.setProductDetail(productDetail)
    //     }

    //     if (userInfo && this.cart.deliverTo && this.product) {
    //       let tokenStoraged = this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    //       if (tokenStoraged && tokenStoraged.accessToken) {
    //         let estimateFee$ = this.estimateFeeService.getEstimateFee(tokenStoraged.accessToken, this.cart.deliverTo._id!, this.product.price);
    //         this.subscription.add(
    //           estimateFee$.subscribe(res => {
    //             if (res) {
    //               this.estimateFeeInfo = res;

    //               this.estimateFeeError = null;
    //             }
    //           }, error => {
    //             console.log(error);

    //             this.estimateFeeInfo = null;
    //             this.estimateFeeError = {
    //               desc: 'AhaMove hiện tại không hỗ trợ vận chuyển đến địa chỉ của bạn vì thế Carota sẽ liên hệ với bạn và chuẩn bị một hình thức vận chuyển khác.'
    //             }
    //             // if(error.status === 406){
    //             //   if(error.error.code === 'INVALID_DISTANCE'){
    //             //     this.estimateFeeError = {
    //             //       desc: 'AhaMove hiện tại không hỗ trợ vận chuyển đến địa của bạn vì thế Carota sẽ liên hệ với bạn và chuẩn bị một hình thức vận chuyển khác.'
    //             //     }
    //             //   }
    //             // }
    //           })
    //         )
    //       }
    //     }
    //   }, error => {
    //     console.log(error);
    //   })
    // );

    if (this.isBrowser) {
      this.subscription.add(
        // this.socketIoService.theRemainingAmoutChange$().subscribe(socketData => {
        //   if (this.product) {
        //     if (this.product._id === socketData.product._id) {
        //       this.product.theRemainingAmount = socketData.product.theRemainingAmount;
        //     }
        //   }
        // })
      )
    }

    this.listenConfig();
  }

  listenConfig() {
    this.subscription.add(
      this.configService.getConfig().subscribe({
        next: (config) => this.configService.set(config),
        error: (err) => console.error('Lỗi lấy cấu hình:', err.message),
        complete: () => console.log('Cấu hình đã được lấy thành công')
      })
    )
  }

  ngAfterViewInit() {

  }

  // listenScroll(product: Product, paginationParams?: PaginationParams) {
  //   this.configPagination = paginationParams;
  //   var body = document.body,
  //     html = document.documentElement;

  //   var height = Math.max(
  //     body.scrollHeight,
  //     body.offsetHeight,
  //     html.clientHeight,
  //     html.scrollHeight,
  //     html.offsetHeight
  //   );

  //   const getTotalProductReview$ = this.productReviewsService.getTotal(product._id);
  //   const getProductReviews$ = this.productReviewsService.get(product._id, paginationParams);

  //   this.subscription.add(
  //     this.mainContainerScrollService.listenScrollTop$.pipe(
  //       map(pos => {
  //         let mainContainer: HTMLDivElement = this.mainContainer ? this.mainContainer.nativeElement : null;
  //         return {
  //           pos,
  //           mainContainer
  //         }
  //       }),
  //       filter(data => {
  //         if (data.mainContainer) {
  //           let bottomElement: number = data.mainContainer.offsetTop + data.mainContainer.offsetHeight;
  //           let total: number = data.pos + height;
  //           if (total >= bottomElement) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         } else {
  //           return false;
  //         }
  //       }),
  //       take(1),
  //       switchMap((data) => combineLatest([getTotalProductReview$, getProductReviews$, of(data.mainContainer)])),
  //       takeUntil(this.scrollToBottomMainContainer)
  //     ).subscribe(([productReviewsTotal, productReviews, mainContainer]) => {
  //       if (productReviews) {
  //         if (this.configPagination) {
  //           let directionPostion: DirectionPostion = {
  //             direction: 'y',
  //             position: mainContainer.offsetTop - headerOffset
  //           }
  //           this.mainContainerScrollService.setDirectionPosition(directionPostion)
  //         }
  //         this.productReviewsResponse = productReviews;
  //         this.configPagination = {
  //           totalItems: this.productReviewsResponse.totalItems,
  //           page: this.productReviewsResponse.page - 1,
  //           size: this.productReviewsResponse.size,
  //           totalPages: this.productReviewsResponse.totalPages
  //         };
  //         this.productReviews = this.productReviewsResponse.data;
  //       }

  //       if (productReviewsTotal) {
  //         this.totalProductReviews = productReviewsTotal;
  //       }
  //     })
  //   )
  // }

  // dosomething(event: any) {
  //   let img: HTMLImageElement = <HTMLImageElement>event.target;
  //   if (img) {
  //     let src: string = img.src;
  //   }
  // }

  // changeQuantity(increase: 'increase' | 'decrease') {
  //   if (!this.product || this.product.quantity) return;
  //   if (increase === 'increase') {
  //     this.product.quantity!++;
  //   } else {
  //     if (this.product.quantity! > 1) {
  //       this.product.quantity!--;
  //     }
  //   }
  // }

  // quantityInputChange(event: Event) {
  //   if (!this.product || this.product.quantity) return;
  //   let value = (event.target as HTMLInputElement).value;
  //   this.product.quantity = !isNaN(parseInt(value)) ? parseInt(value) : 1;
  // }

  // bookNow(product: Product) {
  //   if (!this.product || this.product.quantity) return;
  //   this.cartService.addToCart(product, false);
  //   this.router.navigate(['/cart']);
  //   if (!isDevMode() && this.isBrowser) {
  //     let script = this.renderer2.createElement('script');
  //     script.type = `text/javascript`;
  //     script.text = `fbq('track', 'AddToCart',{
  //       _id: '${product._id}',
  //       name: '${product.name}',
  //       price: ${product.price},
  //       quantity: ${product.quantity},
  //       theRemainingAmount: ${this.product.theRemainingAmount}
  //     });`;
  //     this.renderer2.appendChild(this._document.head, script);
  //   }
  // }

  // addToCart(product: Product) {
  //   this.cartService.addToCart(product, true);
  //   if (!isDevMode() && this.isBrowser) {
  //     let script = this.renderer2.createElement('script');
  //     script.type = `text/javascript`;
  //     script.text = `fbq('track', 'AddToCart',{
  //       _id: '${product._id}',
  //       name: '${product.name}',
  //       price: ${product.price},
  //       quantity: ${product.quantity},
  //       theRemainingAmount: ${product.theRemainingAmount}
  //     });`;
  //     this.renderer2.appendChild(this._document.head, script);
  //   }
  // }

  // contactUs(type: 'messenger' | 'zalo' | 'call') {
  //   if (!isDevMode() && this.isBrowser) {
  //     let script = this.renderer2.createElement('script');
  //     script.type = `text/javascript`;
  //     script.text = `fbq('trackCustom', 'ContactUsButton',{
  //       type: '${type}'
  //     });`;
  //     this.renderer2.appendChild(this._document.head, script);
  //   }
  // }

  // openWriteReviews() {
  //   this.subscription.add(
  //     this.dialog.open(WriteRatingComponent, {
  //       panelClass: 'write-rating-component',
  //       disableClose: true,
  //       data: this.product
  //     }).afterClosed().subscribe(res => {
  //       if (res) {
  //         this.openThanksForTheReview(res);
  //       }
  //     })
  //   )
  // }

  // openThanksForTheReview(productReviews: ProductReviews) {
  //   this.dialog.open(ThanksForTheReviewComponent, {
  //     panelClass: 'thanks-for-the-review-component',
  //     data: productReviews
  //   })
  // }

  bookNow(product: TProductModel) {
    console.log('Book now clicked for product:', product);
    
  }

  addToCart(product: TProductModel) {}

  contactUs(type: 'messenger' | 'zalo' | 'call') {}

  login() {
    this.authService.login('login');
  }

  // onStateChange(event: any, index: number) {
  //   if (event.data === 1) {
  //     this.arrYoutube.forEach(objPlayer => {
  //       if (objPlayer.index != index) {
  //         objPlayer.player.pauseVideo();
  //       }
  //     })
  //   }
  // }

  // savePlayer(player: any, index: number) {
  //   let object: PlayerObject = {
  //     player,
  //     index
  //   }
  //   this.arrYoutube.push(object);
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

interface PlayerObject {
  player: any,
  index: number
}
