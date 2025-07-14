import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { CustomPaginator } from '../../providers/CustomPaginatorConfiguration';

import { Subscription } from 'rxjs';
import { PaginationParams } from '../../models/PaginationParams';
import { LocalStorageService } from '../../services/local-storage.service';
import { ConfigService } from '../../services/api/config.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { OrderPersonalApiService } from '../../services/api/personal/order-personal.api.service';
import { TOrderModel } from '../../models/order-response.interface';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,

    CurrencyCustomPipe,
    PrefixBackendStaticPipe,

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

  
  count: number = 0;
  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private orderPersonalApiService: OrderPersonalApiService,
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.listenOrder();
  }

  listenOrder(paginationParams?: PaginationParams) {
    this.subscription.add(
      this.orderPersonalApiService.getAll(paginationParams?.page, paginationParams?.size).subscribe(res => {
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
