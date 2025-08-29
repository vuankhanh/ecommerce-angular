import { inject, Pipe, PipeTransform } from '@angular/core';
import { TPaymentMethod } from '../../models/payment.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { Language } from '../constant/lang.constant';
import { PAYMENT_METHOD_LABEL } from '../constant/payment.constant';

@Pipe({
  name: 'orderPaymentMethodTranslate',
  standalone: true
})
export class OrderPaymentMethodTranslatePipe implements PipeTransform {
  private readonly localStorageService = inject(LocalStorageService)
  transform(value: TPaymentMethod, ...args: unknown[]): string {
    const lang = this.localStorageService.get('lang') as `${Language}` || 'vi';
    return PAYMENT_METHOD_LABEL[value]?.[lang] || value;
  }

}
