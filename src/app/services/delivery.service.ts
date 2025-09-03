import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeliveryEntity } from '../entity/deliverty.entity';
import { LocalStorageService } from './local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';
import { TDeliveryModel } from '../models/address.interface';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly bDeliveryStoraged = new BehaviorSubject<DeliveryEntity | TDeliveryModel | null>(null);
  deliveryStoraged$ = this.bDeliveryStoraged.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.get();
    }
  }

  private get() {
    const delivertyLocalStoraged = this.localStorageService.get<DeliveryEntity | TDeliveryModel | null>(LocalStorageKey.DELIVERY);
    this.bDeliveryStoraged.next(delivertyLocalStoraged);
  }

  private set(delivery: DeliveryEntity | TDeliveryModel | null) {
    return this.localStorageService.set(LocalStorageKey.DELIVERY, delivery);
  }

  setDelivery(delivery: DeliveryEntity | TDeliveryModel): void {
    this.bDeliveryStoraged.next(delivery);
    this.set(delivery);
  }

  reset(): void {
    this.bDeliveryStoraged.next(null);
    this.set(null);
  }
}
