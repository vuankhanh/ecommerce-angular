import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/api/order.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { OrderPersonalApiService, TOrder } from '../../services/api/personal/order-personal.api.service';
import { TOrderDetailModel } from '../../models/order-response.interface';
import { AddressPipe } from '../../sharing/pipe/address.pipe';

@Component({
  selector: 'app-order-history-detail',
  standalone: true,
  imports: [
    CommonModule,

    RouterLink,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,

    MaterialModule
  ],
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.scss']
})
export class OrderHistoryDetailComponent implements OnInit, OnDestroy {
  orderDetail?: TOrderDetailModel;

  displayedColumns: string[] = ['name', 'price', 'quantity'];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderPersonalApiService: OrderPersonalApiService
  ) {
  }

  ngOnInit(): void {
    const orderId = this.activatedRoute.snapshot.params['id'];
    this.subscription.add(
      this.orderPersonalApiService.getDetail(orderId).subscribe(res => {
        this.orderDetail = res;
      })
    )
  }

  cancelOrder() {

  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
