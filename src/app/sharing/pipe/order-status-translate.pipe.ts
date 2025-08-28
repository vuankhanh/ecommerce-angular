import { inject, Pipe, PipeTransform } from '@angular/core';
import { ORDER_STATUS_LABEL, OrderStatus } from '../constant/order.constant';
import { LocalStorageService } from '../../services/local-storage.service';
import { Language } from '../constant/lang.constant';

@Pipe({
  name: 'orderStatusTranslate',
  standalone: true
})
export class OrderStatusTranslatePipe implements PipeTransform {
  private readonly localStorageService = inject(LocalStorageService)
  transform(value: `${OrderStatus}`, ...args: unknown[]): string {
    const lang = this.localStorageService.get('lang') as `${Language}` || 'vi';
    return ORDER_STATUS_LABEL[value]?.[lang] || value;
  }

}
