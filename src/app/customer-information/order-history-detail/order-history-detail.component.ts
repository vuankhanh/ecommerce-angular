import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/api/order.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Product } from '../../models/Product';
import { TOrderModel } from '../../models/order.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { TOrderDetailResponseModel } from '../../models/order-response.interface';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';

@Component({
  selector: 'app-order-history-detail',
  standalone: true,
  imports: [
    CommonModule,

    RouterLink,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.scss']
})
export class OrderHistoryDetailComponent implements OnInit, OnDestroy {
  orderId: string;

  order?: TOrderDetailResponseModel;

  displayedColumns: string[] = ['name', 'price', 'quantity'];

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private localStorageService: LocalStorageService
  ) {
    this.orderId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.listenOrderHistoryDetail(this.orderId);
  }

  listenOrderHistoryDetail(orderId: string) {
    this.subscription.add(
      this.orderService.getDetail(orderId).subscribe(res => {
        this.order = res;

      })
    )
  }

  showDetail(product: Product) {
    this.router.navigate(['san-pham/' + product.category.route, product._id]);
  }

  revoke(id: string) {
    // this.subscription.add(
    //   this.orderService.revoke(id).subscribe(res => {
    //     this.order = res;
    //   })
    // )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
