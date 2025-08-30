import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TOrderModel } from '../../../models/order.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-successful',
  standalone: true,
  imports: [
    CommonModule,

    MatIconModule
  ],
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent {
  public readonly dialogRef: MatDialogRef<PaymentSuccessfulComponent> = inject(MatDialogRef<PaymentSuccessfulComponent>);
  public readonly orderModel: TOrderModel = inject(MAT_DIALOG_DATA);

  goOrderHistory() {
    this.dialogRef.close('goOrderHistory');
  }

}