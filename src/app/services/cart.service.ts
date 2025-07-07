import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LocalStorageService } from './local-storage.service'

import { ProductDetailEntity } from '../entity/product-detail.entity';
import { ToastService } from './toast.service';
// import { SocketIoService } from './socket/socket-io.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { CartEntity, CartItemEntity } from '../entity/cart.entity';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly rawCart: CartEntity = new CartEntity([]);
  private readonly bCartStoraged: BehaviorSubject<CartEntity> = new BehaviorSubject<CartEntity>(this.rawCart);
  cartStoraged$: Observable<CartEntity> = this.bCartStoraged.asObservable();
  
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {
    if (isPlatformBrowser(platformId)) {
      this.get();
    }
  }

  private get() {
    const cartItemsLocalStoraged: string = this.localStorageService.get(LocalStorageKey.CART);
    let cart: CartEntity;
    try {
      const jsonParse: CartItemEntity[] = JSON.parse(cartItemsLocalStoraged);
      cart = new CartEntity(jsonParse);
    } catch (error: any) {
      this.toastService.shortToastError('Lỗi khi lấy dữ liệu giỏ hàng từ LocalStorage', 'Lỗi');
      this.set(this.rawCart); // Nếu có lỗi thì khởi tạo giỏ hàng mới
      cart = this.rawCart;
    }

    this.bCartStoraged.next(cart);
  }

  private set(cart: CartEntity) {
    const cartStringify: string = JSON.stringify(cart.cartItems); // Chỉ lưu trữ data, không cần methods
    return this.localStorageService.set(LocalStorageKey.CART, cartStringify);
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

  resetProduct() {
    const cart: CartEntity = this.bCartStoraged.getValue();
    cart.resetCart();
    this.bCartStoraged.next(cart);
    this.set(cart);
  }
}