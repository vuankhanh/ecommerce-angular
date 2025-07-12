import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IJwtDecoded } from '../../models/token.interface';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

import { MaterialModule } from '../../sharing/module/material';
import { EmptyCartComponent } from '../../sharing/component/empty-cart/empty-cart.component';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { NumberInputComponent } from '../../sharing/component/number-input/number-input.component';

import { Observable, Subscription, take, map, lastValueFrom, tap } from 'rxjs';
import { CartEntity, CartItemEntity } from '../../entity/cart.entity';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterLink,

    EmptyCartComponent,
    NumberInputComponent,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  cart$: Observable<CartEntity> = this.cartService.cartStoraged$.pipe(
    tap(cart => {
      console.log(cart);
    })
  );

  jwtDecoded$: Observable<IJwtDecoded | null> = this.authService.jwtPayload$;

  private subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private renderer2: Renderer2,
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

  }

  cartItemsQuantityChange(cartItem: CartItemEntity, value: number) {
    this.cartService.changeQuantity(cartItem, value)
  }

  removeCartItem(cartItem: CartItemEntity, cartItemElement: HTMLDivElement) {
    this.renderer2.addClass(cartItemElement, 'cart-item-removed');
    setTimeout(() => {
      this.cartService.removeItem(cartItem);
    }, 450);
  }

  async order() {
    const cartItems: CartItemEntity[] = await lastValueFrom(this.cart$.pipe(
      take(1),
      map(cart => cart.cartItems)
    ));
    console.log(cartItems);

    if (cartItems.length === 0) {
      this.toastService.shortToastError('Giỏ hàng của bạn đang trống!', 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.');
      return;
    }
    this.router.navigate(['/thanh-toan']);
  }

  ngOnDestroy() {
    // if (this.customerForm && this.customerForm.valid) {
    //   let address: Address = this.addressValue();
    //   this.cartService.setDelivery(address);
    // }
    this.subscription.unsubscribe();
  }
}
