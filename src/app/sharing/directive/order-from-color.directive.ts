import { Directive, ElementRef, inject, Input, OnChanges, Renderer2 } from '@angular/core';
import { OrderFrom } from '../constant/order.constant';

@Directive({
  selector: '[appOrderFromColor]',
  standalone: true
})
export class OrderFromColorDirective implements OnChanges {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);
  @Input('appOrderFromColor') orderFrom!: `${OrderFrom}`; // Trạng thái đơn hàng

  ngOnChanges() {
    let bgColor = '';
    let color = '#fff';
    switch (this.orderFrom) {
      case OrderFrom.VISITOR:
        bgColor = '#FF9800'; // Màu cam
        break;
      case OrderFrom.LOYALTY:
        bgColor = '#4CAF50'; // Màu xanh lá
        break;
      case OrderFrom.ADMIN:
        bgColor = '#2196F3'; // Màu xanh dương
        break;
      default:
        bgColor = '#E0E0E0'; // Màu xám nhạt
        color = '#333'; // Màu chữ mặc định
        break;
    }
    const chip = this.el.nativeElement.querySelector('mat-chip');
    if (chip) {
      this.renderer.setStyle(chip, 'background-color', bgColor);
      this.renderer.setStyle(chip, 'font-weight', 'bold');
      // Set color cho text-label bên trong chip
      const textLabel = chip.querySelector('.mdc-evolution-chip__text-label');
      if (textLabel) {
        this.renderer.setStyle(textLabel, 'color', color);
      }
    }
  }
}
