import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { CustomPaginator } from '../../providers/CustomPaginatorConfiguration';


import { Subscription } from 'rxjs';
import { OrderResponse, OrderService } from '../../services/api/order.service';
import { PaginationParams } from '../../models/PaginationParams';
import { LocalStorageService } from '../../services/local-storage.service';
import { ConfigService } from '../../services/api/config.service';
import { TToken } from '../../models/token.interface';
import { OrderEntity } from '../../entity/order.entity';
import { TOrderModel } from '../../models/order.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,

    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class OrderHistoryComponent implements OnInit {
  displayedColumns: string[] = ['orderCode', 'createdAt', 'name', 'totalValue', 'status'];

  configPagination?: PaginationParams;
  orders: Array<TOrderModel> = [];

  subscription: Subscription = new Subscription();

  count: number = 0;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private orderService: OrderService,
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    // this.listenOrder();
  }

  listenOrder(paginationParams?: PaginationParams) {
    this.subscription.add(
      this.orderService.getAll(paginationParams?.page, paginationParams?.size).subscribe(res => {
        const { data, paging } = res;

        this.configPagination = {
          totalItems: paging.totalItems,
          page: paging.page - 1,
          size: paging.size,
          totalPages: paging.totalPages
        };
        this.orders = data;
      })
    )
  }

  handlePageEvent(event: PageEvent) {
    if (this.configPagination === undefined) return;
    this.configPagination.page = event.pageIndex + 1;
    this.configPagination.size = event.pageSize;
    this.listenOrder(this.configPagination)
  }

  showDetail(order: TOrderModel) {
    this.router.navigate(['/khach-hang/order-history', order._id]);
  }

}
