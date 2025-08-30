import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LocalStorageService } from './local-storage.service'

import { ToastService } from './toast.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { CartEntity, CartItemEntity } from '../entity/cart.entity';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly toastService: ToastService = inject(ToastService);

  private readonly rawCart: CartEntity = new CartEntity([]);
  private readonly bCartStoraged: BehaviorSubject<CartEntity> = new BehaviorSubject<CartEntity>(this.rawCart);
  cartStoraged$: Observable<CartEntity> = this.bCartStoraged.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.get();
    }
  }

  private get() {
    const cartItemsLocalStoraged: CartItemEntity[] | null = this.localStorageService.get(LocalStorageKey.CART);

    let cart: CartEntity;
    if (!cartItemsLocalStoraged) {
      this.set(this.rawCart); // Nếu có lỗi thì khởi tạo giỏ hàng mới
      cart = this.rawCart;
    } else {
      try {
        cart = new CartEntity(cartItemsLocalStoraged);
      } catch {
        this.set(this.rawCart); // Nếu có lỗi thì khởi tạo giỏ hàng mới
        cart = this.rawCart;
      }
    }

    this.bCartStoraged.next(cart);
  }

  private set(cart: CartEntity) {
    return this.localStorageService.set(LocalStorageKey.CART, cart.cartItems);
  }

  addToCart(cartItem: CartItemEntity): void {
    const cart: CartEntity = this.bCartStoraged.getValue();
    cart.addItem(cartItem);

    this.bCartStoraged.next(cart);
    this.set(cart);
  }

  changeQuantity(cartItem: CartItemEntity, quantity: number): void {
    const cart: CartEntity = this.bCartStoraged.getValue();
    try {
      cart.changeQuantity(cartItem, quantity);
      this.bCartStoraged.next(cart);
      this.set(cart);
    } catch (error: any) {
      this.toastService.shortToastError(error.message as string, 'Lỗi');
    }
  }

  removeItem(cartItem: CartItemEntity): void {
    const cart: CartEntity = this.bCartStoraged.getValue();
    cart.removeItem(cartItem);
    this.bCartStoraged.next(cart);
    this.set(cart);
  }

  reset() {
    const cart: CartEntity = this.bCartStoraged.getValue();
    cart.resetCart();
    this.bCartStoraged.next(cart);
    this.set(cart);
  }
}