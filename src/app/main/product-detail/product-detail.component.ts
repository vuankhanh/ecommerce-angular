import { AfterViewInit, Component, ElementRef, Inject, isDevMode, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AddressChooseComponent } from '../../sharing/modal/address-choose/address-choose.component';
import { WriteRatingComponent } from '../../sharing/modal/write-rating/write-rating.component';
import { ThanksForTheReviewComponent } from '../../sharing/modal/thanks-for-the-review/thanks-for-the-review.component';

//Pipe
import { GalleryRoutePipe } from '../../pipes/gallery-route.pipe';

import { Product } from '../../models/Product';
import { Media } from '../../models/ProductGallery';
import { UserInformation } from '../../models/UserInformation';
import { Address } from '../../models/Address';
import { MetaTagFacebook } from '../../models/MetaTag';
import { Identification } from '../../models/Identification';
import { Rating } from '../../models/ServerConfig';
import { ProductReviews } from '../../models/ProductReviews';
import { PaginationParams } from '../../models/PaginationParams';

import { Cart, CartService } from '../../services/cart.service';
import { ProductReviewsResponse, ProductReviewsService, TotalProductReviews } from '../../services/api/product/product-reviews.service';
import { AuthService } from '../../services/auth.service';
import { AddressModificationService } from '../../services/address-modification.service';
import { ResponseAddress } from '../../services/api/customer-address.service';
import { EstimateFeeService } from '../../services/api/estimate-fee.service';
import { LocalStorageService } from '../../services/local-storage.service';
// import { SocketIoService } from '../../services/socket/socket-io.service';
import { SEOService } from '../../services/seo.service';
import { InProgressSpinnerService } from '../../services/in-progress-spinner.service';
import { ConfigService } from '../../services/api/config.service';
import { MainContainerScrollService, DirectionPostion } from '../../services/main-container-scroll.service';

import { combineLatest, of, Subject, Subscription } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MaterialModule } from '../../sharing/module/material';
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe';
import { TheDayOfWeekPipe } from '../../pipes/the-day-of-week-format.pipe';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PostsComponent } from '../../sharing/component/posts/posts.component';
import { RatingComponent } from '../../sharing/component/rating/rating.component';
import { PaginationComponent } from '../../sharing/component/pagination/pagination.component';
import { ProductCategoryHomePageComponent } from '../product-category-home-page/product-category-home-page.component';

const headerOffset = 85;
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,

    GalleryRoutePipe,
    ReplaceSpacePipe,
    TheDayOfWeekPipe,

    YouTubePlayerModule,
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

  playerVars: YT.PlayerVars = {
    controls: 1,
    rel: 0,
    showinfo: 0,
    modestbranding: 1,
    playsinline: 1,
    enablejsapi: 1,
    iv_load_policy: 3, // Disable annotations
    cc_load_policy: 0, // Disable closed captions
    fs: 0, // Disable fullscreen button
    loop: 1, // Enable looping
    playlist: '', // Add playlist ID if needed
    start: 0, // Start at the beginning of the video
    end: 0 // End at the end of the video
  };

  arrYoutube: Array<PlayerObject> = [];

  detailId: string = '';
  userInformation: UserInformation | null = null;
  product?: Product;
  productReviews: Array<ProductReviews> = [];
  configPagination: PaginationParams | undefined;
  productReviewsResponse?: ProductReviewsResponse;
  totalProductReviews: TotalProductReviews = {
    totalProductReviewsReponse: {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
    },
    totalRating: 0,
    existRating: 0,
    averageRating: 0
  }
  cart?: Cart;

  estimateFeeInfo: any = null;
  estimateFeeError: any;

  imgMain?: Media;
  indexImgMain: number = 0;
  headquartersAddress?: Address;

  identification?: Identification;
  rating: Array<Rating> = [];

  subscription: Subscription = new Subscription();
  scrollToBottomMainContainer: Subject<null> = new Subject<null>();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer2: Renderer2,
    private dialog: MatDialog,
    private galleryRoutePipe: GalleryRoutePipe,
    private productReviewsService: ProductReviewsService,
    private cartService: CartService,
    private authService: AuthService,
    private addressModificationService: AddressModificationService,
    private estimateFeeService: EstimateFeeService,
    private localStorageService: LocalStorageService,
    // private socketIoService: SocketIoService,
    private seoService: SEOService,
    private inProgressSpinnerService: InProgressSpinnerService,
    private configService: ConfigService,
    private mainContainerScrollService: MainContainerScrollService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const activatedRouteData$ = this.activatedRoute.data.pipe(
      filter(data => !!data),
      map(data => data['product'])
    )
    const cartChange$ = this.cartService.listenCartChange();
    const userInformation$ = this.authService.getUserInformation();
    this.subscription.add(
      combineLatest(
        [
          userInformation$,
          cartChange$,
          activatedRouteData$
        ]
      ).subscribe(([userInfo, cart, productDetail]) => {

        if (userInfo) {
          this.userInformation = userInfo;
        }

        this.cart = cart;
        if (this.cart.deliverTo) {
          this.headquartersAddress = this.cart.deliverTo;
        }
        if (productDetail) {
          this.setProductDetail(productDetail)
        }

        if (userInfo && this.cart.deliverTo && this.product) {
          let tokenStoraged = this.localStorageService.get(this.localStorageService.tokenStoragedKey);
          if (tokenStoraged && tokenStoraged.accessToken) {
            let estimateFee$ = this.estimateFeeService.getEstimateFee(tokenStoraged.accessToken, this.cart.deliverTo._id!, this.product.price);
            this.subscription.add(
              estimateFee$.subscribe(res => {
                if (res) {
                  this.estimateFeeInfo = res;

                  this.estimateFeeError = null;
                }
              }, error => {
                console.log(error);

                this.estimateFeeInfo = null;
                this.estimateFeeError = {
                  desc: 'AhaMove hiện tại không hỗ trợ vận chuyển đến địa chỉ của bạn vì thế Carota sẽ liên hệ với bạn và chuẩn bị một hình thức vận chuyển khác.'
                }
                // if(error.status === 406){
                //   if(error.error.code === 'INVALID_DISTANCE'){
                //     this.estimateFeeError = {
                //       desc: 'AhaMove hiện tại không hỗ trợ vận chuyển đến địa của bạn vì thế Carota sẽ liên hệ với bạn và chuẩn bị một hình thức vận chuyển khác.'
                //     }
                //   }
                // }
              })
            )
          }
        }
      }, error => {
        console.log(error);
      })
    );

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

  listenScroll(product: Product, paginationParams?: PaginationParams) {
    this.configPagination = paginationParams;
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    const getTotalProductReview$ = this.productReviewsService.getTotal(product._id);
    const getProductReviews$ = this.productReviewsService.get(product._id, paginationParams);

    this.subscription.add(
      this.mainContainerScrollService.listenScrollTop$.pipe(
        map(pos => {
          let mainContainer: HTMLDivElement = this.mainContainer ? this.mainContainer.nativeElement : null;
          return {
            pos,
            mainContainer
          }
        }),
        filter(data => {
          if (data.mainContainer) {
            let bottomElement: number = data.mainContainer.offsetTop + data.mainContainer.offsetHeight;
            let total: number = data.pos + height;
            if (total >= bottomElement) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }),
        take(1),
        switchMap((data) => combineLatest([getTotalProductReview$, getProductReviews$, of(data.mainContainer)])),
        takeUntil(this.scrollToBottomMainContainer)
      ).subscribe(([productReviewsTotal, productReviews, mainContainer]) => {
        if (productReviews) {
          if (this.configPagination) {
            let directionPostion: DirectionPostion = {
              direction: 'y',
              position: mainContainer.offsetTop - headerOffset
            }
            this.mainContainerScrollService.setDirectionPosition(directionPostion)
          }
          this.productReviewsResponse = productReviews;
          this.configPagination = {
            totalItems: this.productReviewsResponse.totalItems,
            page: this.productReviewsResponse.page - 1,
            size: this.productReviewsResponse.size,
            totalPages: this.productReviewsResponse.totalPages
          };
          this.productReviews = this.productReviewsResponse.data;
        }

        if (productReviewsTotal) {
          this.totalProductReviews = productReviewsTotal;
        }
      })
    )
  }

  changeIndex(index: number) {
    this.configPagination!.page = index;
    if (this.product) this.listenScroll(this.product, this.configPagination);
  }

  dosomething(event: any) {
    let img: HTMLImageElement = <HTMLImageElement>event.target;
    if (img) {
      let src: string = img.src;
    }
  }

  setProductDetail(product: Product) {
    let currentUrl = 'https://carota.vn' + this.router.url;
    if (product) {
      if (!this.product || this.product._id != product._id) {
        this.product = product;
        if (this.isBrowser) {
          this.listenScroll(this.product);
        }
        if (!isDevMode() && this.isBrowser) {
          //Facebook Pixel
          let script = this.renderer2.createElement('script');
          script.type = `text/javascript`;
          script.text = `fbq('track', 'ViewContent',{
            _id: '${this.product._id}',
            name: '${this.product.name}',
            price: ${this.product.price},
            quantity: ${this.product.quantity},
            theRemainingAmount: ${this.product.theRemainingAmount}
          });`;
          this.renderer2.appendChild(this._document.head, script);

          //Google structured data
          let images = this.product.albumImg?.media.map(media => "\"" + this.galleryRoutePipe.transform(media.src) + "\"");

          let googleSchemaScript = this.renderer2.createElement('script');
          googleSchemaScript.type = 'application/ld+json';
          googleSchemaScript.text = `{
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "${this.product.name}",
            "image": [${images}],
            "description": "${this.product.sortDescription}",
            "brand": {
              "@type": "Brand",
              "name": "Thủy hải sản Carota"
            },
            "offers": {
              "@type": "Offer",
              "url": "${currentUrl}",
              "priceCurrency": "${this.product.currencyUnit}",
              "price": "${this.product.price}",
              "priceValidUntil": "2022-12-31",
              "itemCondition": "https://schema.org/UsedCondition",
              "availability": "https://schema.org/InStock"
            }
          }`;
          this.renderer2.appendChild(this._document.head, googleSchemaScript);
        }


        if (!this.product.quantity) {
          this.product.quantity = 1;
        }
        let index: number = this.product.albumImg!.media.findIndex(media => media.isMain);
        index >= 0 ? this.setImgMain(index) : this.setImgMain(0);

        let metaTagFacebook: MetaTagFacebook = {
          title: this.product.name,
          image: this.galleryRoutePipe.transform(this.product.thumbnailUrl),
          imageAlt: this.product.name,
          imageType: 'image/png',
          imageWidth: '100',
          imageHeight: '100',
          url: currentUrl,
          description: this.product.sortDescription,

          productBrand: 'Thủy hải sản Carota',
          productAvailability: 'in stock',
          productCondition: 'new',
          productPriceAmount: this.product.price.toString(),
          productPriceCurrency: this.product.currencyUnit,
          productRetailerItemId: this.product.route,
          productItemGroupId: this.product.category.route,
          googleProductCategory: this.product.category.googleProductCategory,
        }
        this.seoService.updateTitle(this.product.name);
        this.seoService.updateMetaTagFacebook(metaTagFacebook);
      }
    }
  }

  setImgMain(index: number) {
    this.indexImgMain = index;
    this.imgMain = this.product?.albumImg!.media[index];
  }

  setImgMainDirection(direction: string) {
    if (this.isBrowser) {
      if (direction === 'toLeft') {
        if (this.imgMain?._id != this.product?.albumImg?.media[0]._id) {
          this.indexImgMain--;
          this.product?.albumImg?.media[this.indexImgMain] ? this.imgMain = this.product?.albumImg?.media[this.indexImgMain] : this.product?.albumImg?.media[0];
          const elementId = window.document.getElementById("list-item-" + this.indexImgMain)! as HTMLDivElement;

          this.listImg?.nativeElement.scrollTo({ left: this.indexImgMain * elementId.offsetWidth, behavior: "smooth" });
        }
      } else if (direction === 'toRight') {
        if (this.imgMain?._id != this.product?.albumImg?.media[this.product?.albumImg?.media.length - 1]._id) {
          this.indexImgMain++;
          this.product?.albumImg?.media[this.indexImgMain] ? this.imgMain = this.product?.albumImg?.media[this.indexImgMain] : this.product?.albumImg?.media[0];
          const elementId = window.document.getElementById("list-item-" + this.indexImgMain)! as HTMLDivElement;

          this.listImg?.nativeElement.scrollTo({ left: this.indexImgMain * elementId.offsetWidth, behavior: "smooth" })
        }
      } else {
        console.log('Hướng không xác định');
      }
    }
  }

  chooseAddress(headquartersAddress: Address) {
    if (!this.userInformation) {
      this.authService.login('login');
    } else {
      this.subscription.add(
        this.dialog.open(AddressChooseComponent, {
          panelClass: 'address-choose',
          data: {
            defaultAddress: headquartersAddress
          }
        }).afterClosed().subscribe(res => {
          if (res && res.deliverTo) {
            let address: Address = res.deliverTo;
            this.headquartersAddress = address;
            this.cartService.setDelivery(this.headquartersAddress);
          }
        })
      )
    }
  }

  insertAddress() {
    if (!this.userInformation) {
      this.authService.login('login');
    } else {
      this.subscription.add(
        this.addressModificationService.openAddressModification('insert', null).subscribe(res => {
          if (res) {
            let responseAddress: ResponseAddress = res;
            let address: Address = responseAddress.address[0];
            this.cartService.setDelivery(address);
          }
        })
      );
    }
  }

  changeQuantity(increase: 'increase' | 'decrease') {
    if (!this.product || this.product.quantity) return;
    if (increase === 'increase') {
      this.product.quantity!++;
    } else {
      if (this.product.quantity! > 1) {
        this.product.quantity!--;
      }
    }
  }

  quantityInputChange(event: Event) {
    if (!this.product || this.product.quantity) return;
    let value = (event.target as HTMLInputElement).value;
    this.product.quantity = !isNaN(parseInt(value)) ? parseInt(value) : 1;
  }

  bookNow(product: Product) {
    if (!this.product || this.product.quantity) return;
    this.cartService.addToCart(product, false);
    this.router.navigate(['/cart']);
    if (!isDevMode() && this.isBrowser) {
      let script = this.renderer2.createElement('script');
      script.type = `text/javascript`;
      script.text = `fbq('track', 'AddToCart',{
        _id: '${product._id}',
        name: '${product.name}',
        price: ${product.price},
        quantity: ${product.quantity},
        theRemainingAmount: ${this.product.theRemainingAmount}
      });`;
      this.renderer2.appendChild(this._document.head, script);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, true);
    if (!isDevMode() && this.isBrowser) {
      let script = this.renderer2.createElement('script');
      script.type = `text/javascript`;
      script.text = `fbq('track', 'AddToCart',{
        _id: '${product._id}',
        name: '${product.name}',
        price: ${product.price},
        quantity: ${product.quantity},
        theRemainingAmount: ${product.theRemainingAmount}
      });`;
      this.renderer2.appendChild(this._document.head, script);
    }
  }

  contactUs(type: 'messenger' | 'zalo' | 'call') {
    if (!isDevMode() && this.isBrowser) {
      let script = this.renderer2.createElement('script');
      script.type = `text/javascript`;
      script.text = `fbq('trackCustom', 'ContactUsButton',{
        type: '${type}'
      });`;
      this.renderer2.appendChild(this._document.head, script);
    }
  }

  openWriteReviews() {
    this.subscription.add(
      this.dialog.open(WriteRatingComponent, {
        panelClass: 'write-rating-component',
        disableClose: true,
        data: this.product
      }).afterClosed().subscribe(res => {
        if (res) {
          this.openThanksForTheReview(res);
        }
      })
    )
  }

  openThanksForTheReview(productReviews: ProductReviews) {
    this.dialog.open(ThanksForTheReviewComponent, {
      panelClass: 'thanks-for-the-review-component',
      data: productReviews
    })
  }

  login() {
    this.authService.login('login');
  }

  onStateChange(event: any, index: number) {
    if (event.data === 1) {
      this.arrYoutube.forEach(objPlayer => {
        if (objPlayer.index != index) {
          objPlayer.player.pauseVideo();
        }
      })
    }
  }

  savePlayer(player: any, index: number) {
    let object: PlayerObject = {
      player,
      index
    }
    this.arrYoutube.push(object);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

interface PlayerObject {
  player: any,
  index: number
}
