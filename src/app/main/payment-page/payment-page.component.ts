import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

import { PaymentSuccessfulComponent } from '../../sharing/modal/payment-successful/payment-successful.component';
import { UserInformation } from '../../models/UserInformation';
import { CartService } from '../../services/cart.service';
import { take, map, Observable, Subscription, switchMap, filter, lastValueFrom, combineLatest, tap, startWith } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/api/order.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';

import { TToken } from '../../models/token.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { EmptyCartComponent } from '../../sharing/component/empty-cart/empty-cart.component';
import { LocalStorageKey } from '../../sharing/constant/local_storage.constant';
import { CartEntity, CartItemEntity } from '../../entity/cart.entity';
import { ProductDetailEntity } from '../../entity/product-detail.entity';
import { DeliveryEntity } from '../../entity/deliverty.entity';
import { DeliveryService } from '../../services/delivery.service';
import { AddressPipe } from '../../sharing/pipe/address.pipe';
import { DeliveryComponent } from '../../sharing/modal/delivery/delivery.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IOrderCreateRequest, IOrderItemsRequest } from '../../services/api/order-request.interface';
import { PaymentMethod } from '../../sharing/constant/payment.constant';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,

    EmptyCartComponent,

    MaterialModule
  ],
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  @ViewChild('btnInsertAddress') btnInsertAddress!: ElementRef;

  delivery$: Observable<DeliveryEntity | null> = this.deliveryService.deliveryStoraged$;
  cart$: Observable<CartEntity> = this.cartService.cartStoraged$;
  private cartItem$ = this.cart$.pipe(
    map(cart => cart.cartItems)
  )

  noteControl: FormControl = new FormControl<string>('');

  lastValue$ = combineLatest([this.cartItem$, this.delivery$, this.noteControl.valueChanges.pipe(startWith(''))]).pipe(
    tap(([cartItems, delivery, note]) => {
      console.log(cartItems, delivery, note);
      
    }),
    filter(([cartItems, delivery, note]) => {
      return !!cartItems && cartItems.length > 0 && !!delivery;
    }),
    map(([cartItems, delivery, note]) => {
      const orderItemsRequests: IOrderItemsRequest[] = cartItems.map((item: CartItemEntity) => {
        return {
          productId: item.product._id,
          quantity: item.quantity
        }
      });
      return { cartItems: orderItemsRequests, delivery, note };
    }),
    map(value => {
      const orderCreateRequest: IOrderCreateRequest = {
        orderItems: value.cartItems,
        paymentMethod: PaymentMethod.CASH,
        deliveryFee: 0,
        discount: 0,
        note: this.noteControl.value,
        delivery: value.delivery as DeliveryEntity
      }
      return orderCreateRequest;
    })
  )

  displayedColumns: string[] = ['thumbnail', 'name', 'price', 'quantity'];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private renderer2: Renderer2,
    private cartService: CartService,
    private readonly deliveryService: DeliveryService,
    private authService: AuthService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void { }

  chooseAddress() {
    console.log('chooseAddress');
    this.subscription.add(
      this.delivery$.pipe(
        take(1),
        switchMap(delivery => this.dialog.open(DeliveryComponent, {
          panelClass: 'delivery-modal',
          data: delivery
        }).afterClosed()),
        filter(delivery => !!delivery)
      ).subscribe((delivery: DeliveryEntity) => {
        console.log(delivery);

        this.deliveryService.modifyDelivery(delivery);
      })
    )
  }

  async confirmPayment() {
    this.lastValue$.pipe(
      switchMap((orderCreateRequest: IOrderCreateRequest) => this.orderService.create(orderCreateRequest)),
      take(1),
    ).subscribe(order => {
      console.log(order)
    })
    // if (this.userInformation) {
    //   let tokenStoraged: TToken = <TToken>this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
    //   if (tokenStoraged && tokenStoraged.accessToken) {
    //     this.subscription.add(
    //       this.orderService.insert(tokenStoraged.accessToken, this.cart!).subscribe(async order => {
    //         await this.router.navigate(['/san-pham']);
    //         this.cartService.resetProduct();
    //         this.dialog.open(PaymentSuccessfulComponent,
    //           {
    //             panelClass: 'payment-success-modal',
    //             data: { isLoyalCustomer: true, order },
    //             autoFocus: false
    //           }
    //         ).afterClosed().subscribe(res => {
    //           let result: 'goProduct' | 'goOrderHistory' = res;
    //           if (result === 'goOrderHistory') {
    //             this.router.navigate(['/customer/order-history']);
    //           }
    //         })
    //       }, error => {
    //         this.toastService.shortToastError(error.error.message, 'Đã có lỗi xảy ra');
    //       })
    //     )
    //   }
    // } else {
    //   this.subscription.add(
    //     this.orderService.insertFromVitors(this.cart!).subscribe(async order => {
    //       await this.router.navigate(['/san-pham']);
    //       this.cartService.resetProduct();
    //       this.dialog.open(PaymentSuccessfulComponent,
    //         {
    //           panelClass: 'payment-success-modal',
    //           data: { isLoyalCustomer: false, order },
    //           autoFocus: false
    //         }
    //       )
    //     }, error => {
    //       this.toastService.shortToastError(error.error.message, 'Đã có lỗi xảy ra');
    //     })
    //   )
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
