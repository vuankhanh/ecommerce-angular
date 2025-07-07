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
    const delivertyLocalStoraged: string = this.localStorageService.get(LocalStorageKey.DELIVERY);
    let delivery: DeliveryEntity | null;
    try {
      delivery = JSON.parse(delivertyLocalStoraged);
    } catch (error: any) {
      this.toastService.shortToastError('Lỗi khi lấy thông tin giao hàng từ LocalStorage', 'Lỗi');
      this.set(null); // Nếu có lỗi thì khởi tạo giỏ hàng mới
      delivery = null;
    }

    this.bDeliveryStoraged.next(delivery);
  }

  private set(delivery: DeliveryEntity | null) {
    const deliveryStringify: string = JSON.stringify(delivery); // Chỉ lưu trữ data, không cần methods
    return this.localStorageService.set(LocalStorageKey.DELIVERY, deliveryStringify);
  }

  modifyDelivery(delivery: DeliveryEntity): void {
    this.bDeliveryStoraged.next(delivery);
    this.set(delivery);
  }
}
