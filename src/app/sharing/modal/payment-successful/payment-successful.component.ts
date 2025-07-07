import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, isDevMode, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
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
export class PaymentSuccessfulComponent implements OnInit {
  private isBrowser: boolean;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private renderer2: Renderer2,
    public dialogRef: MatDialogRef<PaymentSuccessfulComponent>,
    @Inject(MAT_DIALOG_DATA) public orderModel: TOrderModel,

  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

  }

  goOrderHistory() {
    this.dialogRef.close('goOrderHistory');
  }

}