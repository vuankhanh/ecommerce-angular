import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

import { PaymentSuccessfulComponent } from '../../sharing/modal/payment-successful/payment-successful.component';
import { CartService } from '../../services/cart.service';
import { take, map, Observable, Subscription, switchMap, filter, lastValueFrom, combineLatest, tap, startWith, firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/api/order.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';

import { IJwtDecoded, TToken } from '../../models/token.interface';
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
import { DeliverySelectionComponent } from '../../sharing/modal/delivery-selection/delivery-selection.component';
import { DialogRef } from '@angular/cdk/dialog';
import { TDeliveryModel } from '../../models/address.interface';
import { OrderPersonalApiService } from '../../services/api/personal/order-personal.api.service';

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

  jwtPayload$ = this.authService.jwtPayload$;
  delivery$: Observable<DeliveryEntity | TDeliveryModel | null> = this.deliveryService.deliveryStoraged$;
  cart$: Observable<CartEntity> = this.cartService.cartStoraged$;
  private cartItem$ = this.cart$.pipe(
    map(cart => cart.cartItems)
  )

  noteControl: FormControl = new FormControl<string>('');

  lastValue$ = combineLatest([this.cartItem$, this.delivery$, this.noteControl.valueChanges.pipe(startWith(''))]).pipe(
    filter(([cartItems, delivery, note]) => {
      return !!cartItems && cartItems.length > 0 && !!delivery;
    }),
    tap(([cartItems, delivery, note]) => {
      console.log('Payment Page Values:');
      console.log('Cart Items:', cartItems);
      console.log('Delivery:', delivery);
      console.log('Note:', note);

    }),
    map(([cartItems, delivery, note]) => {
      const orderItemsRequests: IOrderItemsRequest[] = cartItems.map((item: CartItemEntity) => {
        return {
          productId: item.product._id,
          quantity: item.quantity
        }
      });
      const newDelivery: DeliveryEntity = new DeliveryEntity(delivery!);
      return { cartItems: orderItemsRequests, delivery: newDelivery.toPlainObject(), note };
    }),
    map(value => {
      const orderCreateRequest: IOrderCreateRequest = {
        orderItems: value.cartItems,
        paymentMethod: PaymentMethod.CASH,
        deliveryFee: 0,
        discount: 0,
        note: this.noteControl.value,
        delivery: value.delivery
      }

      return orderCreateRequest;
    })
  );

  displayedColumns: string[] = ['thumbnail', 'name', 'price', 'quantity'];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private renderer2: Renderer2,
    private toastService: ToastService,
    private cartService: CartService,
    private readonly deliveryService: DeliveryService,
    private authService: AuthService,
    private orderService: OrderService,
    private orderPersonalApiService: OrderPersonalApiService,
  ) { }

  ngOnInit(): void { }

  async chooseAddress() {
    const payload = await lastValueFrom(this.jwtPayload$.pipe(
      take(1)
    ));

    if (!payload) {
      this.singleDeliverySelection();
    } else {
      this.multipleDeliverySelection();
    }
  }

  private singleDeliverySelection() {
    this.subscription.add(
      this.delivery$.pipe(
        take(1),
        switchMap(delivery => this.dialog.open(DeliveryComponent, {
          panelClass: 'delivery-modal',
          data: delivery
        }).afterClosed().pipe(
          filter(deliveryResult => !!deliveryResult),
          map(deliveryResult => {
            if (delivery) return {
              ...delivery,
              ...deliveryResult
            };
            return deliveryResult;
          })
        )),

      ).subscribe((delivery: DeliveryEntity) => {
        this.deliveryService.setDelivery(delivery);
      })
    )
  }

  private multipleDeliverySelection() {
    this.subscription.add(
      this.delivery$.pipe(
        take(1),
        switchMap(delivery => this.dialog.open(DeliverySelectionComponent, {
          panelClass: 'delivery-selection-modal',
          data: delivery && '_id' in delivery ? (delivery as any)._id : null
        }).afterClosed().pipe(
          filter(deliveryResult => !!deliveryResult),
        ))
      ).subscribe((delivery: DeliveryEntity) => {
        this.deliveryService.setDelivery(delivery);
      })
    )
  }

  async confirmPayment() {
    const jwtPayload = await lastValueFrom(this.jwtPayload$.pipe(
      take(1)
    ));

    const lastValue = await lastValueFrom(this.lastValue$.pipe(
      take(1)
    ));
    console.log('Last Value:', lastValue);
    
    if (!jwtPayload) {
      this.orderFromVisitors(lastValue);
    } else {
      this.orderFromLoyalty(lastValue);
    }
  }

  async orderFromVisitors(orderCreateRequest: IOrderCreateRequest) {
    try {
      const order = await firstValueFrom(this.orderService.create(orderCreateRequest).pipe(
        take(1)
      ));
      const dialogRef = this.dialog.open(PaymentSuccessfulComponent,
        {
          panelClass: 'payment-success-modal',
          data: { isLoyalCustomer: false, order },
          autoFocus: false
        }
      );

      this.router.navigate(['/san-pham']);
      this.cartService.reset();
      this.deliveryService.reset();

      let result: 'goProduct' | 'goOrderHistory' = await lastValueFrom(dialogRef.afterClosed().pipe(
        filter(res => !!res),
        take(1)
      ));

      if (result === 'goOrderHistory') {
        this.router.navigate(['/khach-hang/order-history']);
      }
    } catch (error: any) {
      this.toastService.shortToastError(error.error.message, 'Đã có lỗi xảy ra');
    }
  }

  async orderFromLoyalty(orderCreateRequest: IOrderCreateRequest) {
    try {
      const order = await firstValueFrom(this.orderPersonalApiService.create(orderCreateRequest).pipe(
        take(1)
      ));
      this.dialog.open(PaymentSuccessfulComponent,
        {
          panelClass: 'payment-success-modal',
          data: { isLoyalCustomer: true, order },
          autoFocus: false
        }
      )
      this.router.navigate(['/san-pham']);
      this.cartService.reset();
      this.deliveryService.reset();
    } catch (error: any) {
      this.toastService.shortToastError(error.error.message, 'Đã có lỗi xảy ra');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
