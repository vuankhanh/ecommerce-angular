import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { merge, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/Product';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      import('socket.io-client').then(io => {
        this.socket = io.io(environment.socket); // Đảm bảo environment có socketUrl
      });
    }
  }

  socketStatus$(): Observable<boolean> {
    if (!this.socket) return new Observable<boolean>();
    const connect$ = fromEvent(this.socket, 'connect').pipe(map(() => true));
    const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(map(() => false));
    return merge(connect$, disconnect$);
  }

  theRemainingAmoutChange$(): Observable<SocketDataProduct> {
    if (!this.socket) return new Observable<SocketDataProduct>();
    return new Observable(observer => {
      this.socket.on('product-quantity', (data: SocketDataProduct) => observer.next(data));
    });
  }

  theRemainingAmountProductsAfterRefresh$(): Observable<Array<Product>> {
    if (!this.socket) return new Observable<Array<Product>>();
    return new Observable(observer => {
      this.socket.on('the-remaining-amount-products-after-refresh', (data: Array<Product>) => observer.next(data));
    });
  }

  refreshTheRemainingAmountProducts$(ids: Array<string>) {
    if (this.socket) {
      this.socket.emit('refresh-the-remaining-amount-products', ids);
    }
  }
}

export interface SocketDataProduct {
  sender: string,
  product: Product
}