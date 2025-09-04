import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { IDelivery } from '../models/address.interface';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly bDeliveryStoraged = new BehaviorSubject<IDelivery | null>(null);
  deliveryStoraged$ = this.bDeliveryStoraged.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.get();
    }
  }

  private get() {
    const delivertyLocalStoraged = this.localStorageService.get<IDelivery | null>(LocalStorageKey.DELIVERY);
    this.bDeliveryStoraged.next(delivertyLocalStoraged);
  }

  private set(delivery: IDelivery | null) {
    return this.localStorageService.set(LocalStorageKey.DELIVERY, delivery);
  }

  setDelivery(delivery: IDelivery | null): void {
    this.bDeliveryStoraged.next(delivery);
    this.set(delivery);
  }

  reset(): void {
    this.bDeliveryStoraged.next(null);
    this.set(null);
  }
}
