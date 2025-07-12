import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { DeliveryEntity } from '../entity/deliverty.entity';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast.service';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private readonly bDeliveryStoraged: BehaviorSubject<DeliveryEntity | null> = new BehaviorSubject<DeliveryEntity | null>(null);
  deliveryStoraged$: Observable<DeliveryEntity | null> = this.bDeliveryStoraged.asObservable();

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
    const delivertyLocalStoraged: DeliveryEntity | null = this.localStorageService.get(LocalStorageKey.DELIVERY);
    this.bDeliveryStoraged.next(delivertyLocalStoraged);
  }

  private set(delivery: DeliveryEntity | null) {
    return this.localStorageService.set(LocalStorageKey.DELIVERY, delivery);
  }

  modifyDelivery(delivery: DeliveryEntity): void {
    this.bDeliveryStoraged.next(delivery);
    this.set(delivery);
  }

  reset(): void {
    this.bDeliveryStoraged.next(null);
    this.set(null);
  }
}
