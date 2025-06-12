import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LocalStorageService } from './local-storage.service'

import { Address } from '../models/Address';
import { Product } from '../models/Product';
import { ToastService } from './toast.service';
import { HeaderService } from './header.service';
// import { SocketIoService } from './socket/socket-io.service';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartDefault: Cart = {
    deliverTo: null,
    products: [],
    status: 'inLocalStorageCart'
  }

  private isBrowser: boolean;

  private cartStoragedChange$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.get());
  private listenCartStoragedChange: Observable<Cart> = this.cartStoragedChange$.asObservable();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private headerService: HeaderService,
    // private socketIoService: SocketIoService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    //Phát đến Server 
    if(this.isBrowser){
      this.refreshTheRemainingAmout();
      this.listenTheRemainingAmountProducts();
    }
  }

  listenCartChange(): Observable<Cart>{
    return this.listenCartStoragedChange;
  }

  private get(): Cart{
    let cart: Cart| null = this.localStorageService.get(this.localStorageService.carotaCartKey);
    return cart ? cart : this.cartDefault;
  }

  private set(cart: Cart){
    this.cartStoragedChange$.next(cart);
    return this.localStorageService.set(this.localStorageService.carotaCartKey, cart);
  }

  setDelivery(address: Address | null){
    let cart: Cart = this.get();
    cart.deliverTo = address;
    this.set(cart);
  }

  setProduct(products: Array<Product>){
    let cart: Cart = this.get();
    cart.products = products;
    this.set(cart);
  }

  addToCart(product: Product, showAlert: boolean): void{
    let productsInCart: Array<Product> = this.get().products;
    
    let checkExist = productsInCart.some((itemCart: Product) => itemCart._id === product._id);
    if(!checkExist){
      if(!product.quantity){
        product.quantity = 1;
      }
      if(product.quantity>product.theRemainingAmount){
        this.toastService.shortToastWarning(product.name+ ' chỉ còn '+product.theRemainingAmount+ ' sản phẩm', '');
      }else{
        productsInCart.push(product);
        if(showAlert){
          this.headerService.set(true);
        }
      }
    }else{
      for(let itemCart of productsInCart){
        if(itemCart._id === product._id){
          if((itemCart.quantity! + product.quantity!)>product.theRemainingAmount){
            this.toastService.shortToastWarning('Sản phẩm '+product.name+ ' chỉ còn '+product.theRemainingAmount+ ' sản phẩm', '');
          }else{
            itemCart.quantity! += product.quantity!;
            if(showAlert){
              this.headerService.set(true);
            }
          }
        }
      }
    }
    
    this.setProduct(productsInCart);
  }

  resetProduct(){
    this.cartStoragedChange$.next(this.cartDefault);
    this.setProduct([]);
  }

  sumQuantityOfCart(itemCarts: Array<Product>): number{
    let total: number = 0;
    if(itemCarts && itemCarts.length>0){
      for(let product of itemCarts){
        total += product.quantity!;
      }
    }
    return total;
  }

  sumTemporaryValue(products: Array<Product>): number{
    let temporaryValue: number = 0;
    if(products && products.length>0){
      for(let product of products){
        temporaryValue += (product.quantity!*product.price);
      }
    }
    return temporaryValue;
  }

  refreshTheRemainingAmout(){
    let cart: Cart = this.get();
    let products: Array<Product> = cart.products;
    if(products.length>0){
      let ids = products.map(product=>product._id);
      // this.socketIoService.refreshTheRemainingAmountProducts$(ids);
    }
  }

  listenTheRemainingAmountProducts(){
    // this.socketIoService.theRemainingAmountProductsAfterRefresh$().subscribe(theRemainingAmountProducts=>{
    //   if(theRemainingAmountProducts.length>0){
    //     let cart: Cart = this.get();
    //     let products: Array<Product> = cart.products;
    //     for(let i=0; i<=products.length-1; i++){
    //       let product = products[i];
          
    //       let index: number = theRemainingAmountProducts.findIndex(theRemainingAmountProduct=>theRemainingAmountProduct._id === product._id);
    //       if(index>=0){
    //         product.theRemainingAmount = theRemainingAmountProducts[index].theRemainingAmount;
    //       }
    //     }
    //     this.setProduct(products);
    //   }
    // })
  }

  checkMatchingQuantity(): Array<Product>{
    let cart: Cart = this.get();
    let products: Array<Product> = cart.products;
    let productsIsNotMatching: Array<Product> = [];
    if(products.length>0){
      for(let i=0; i<=products.length-1; i++){
        let product = products[i];
  
        if(product.theRemainingAmount < product.quantity!){
          productsIsNotMatching.push(product);
        }
      }
    }

    return productsIsNotMatching;
  }
}

export interface Cart{
  deliverTo: Address | null,
  products: Array<Product>,
  status: 'inLocalStorageCart'
}