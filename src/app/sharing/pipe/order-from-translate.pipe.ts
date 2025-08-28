import { inject, Pipe, PipeTransform } from '@angular/core';
import { ORDER_FROM_LABEL, OrderFrom } from '../constant/order.constant';
import { LocalStorageService } from '../../services/local-storage.service';
import { Language } from '../constant/lang.constant';

@Pipe({
  name: 'orderFromTranslate',
  standalone: true
})
export class OrderFromTranslatePipe implements PipeTransform {
  private readonly localStorageService = inject(LocalStorageService)
  transform(value: `${OrderFrom}`, ...args: unknown[]): string {
    const lang = this.localStorageService.get('lang') as `${Language}` || 'vi';
    return ORDER_FROM_LABEL[value]?.[lang] || value;
  }

}
