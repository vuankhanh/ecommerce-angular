import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, isDevMode, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Order } from 'src/app/models/Order';

@Component({
  selector: 'app-payment-successful',
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
    @Inject(MAT_DIALOG_DATA) public data: Data,
    
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if(this.isBrowser && this.data && this.data.order){
      let order = this.data.order;
      let products: any = order.products;
      let newProduct = products.map((product: any)=>"'"+product.productId+"'");
      let strProducts = newProduct.join(',');
      if(!isDevMode()){
        let script = this.renderer2.createElement('script');
        script.type = `text/javascript`;
        script.text = `fbq('track', 'Purchase',{
          _id: '${order._id}',
          value: ${order.totalValue},
          currency: 'VND',
          products: [${strProducts}],
          phoneNumber: '${order.deliverTo.phoneNumber}',
        });`;
        this.renderer2.appendChild(this._document.head, script);
      }
    }
  }

  goOrderHistory(){
    this.dialogRef.close('goOrderHistory');
  }

}
interface Data{
  isLoyalCustomer: boolean,
  order: Order
}