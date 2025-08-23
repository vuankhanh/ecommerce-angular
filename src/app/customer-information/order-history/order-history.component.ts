import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

import { CustomPaginator } from '../../providers/CustomPaginatorConfiguration';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { OrderPersonalApiService } from '../../services/api/personal/order-personal.api.service';
import { TOrderModel } from '../../models/order-response.interface';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { BehaviorSubject, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { IPagination } from '../../services/api/pagination.interface';
import { PaginationConstant } from '../../sharing/constant/pagination.constant';
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
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  displayedColumns: string[] = ['orderCode', 'createdAt', 'name', 'totalValue', 'status'];

  orders: Array<TOrderModel> = [];
  private readonly bPagination: BehaviorSubject<IPagination> = new BehaviorSubject<IPagination>(PaginationConstant);
  pagination$ = this.bPagination.asObservable();
  
  orderPersonal$ = this.pagination$.pipe(
    distinctUntilChanged((prev, curr) => prev.page === curr.page && prev.size === curr.size),
    switchMap(paginationParams => this.orderPersonalApiService.getAll(paginationParams.page, paginationParams.size))
  );

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private orderPersonalApiService: OrderPersonalApiService,
  ) { }

  ngOnInit(): void {
    this.listenOrder();
  }

  listenOrder() {
    this.subscription.add(
      this.orderPersonal$.subscribe(res => {
        const { data, paging } = res;

        const paginationParams: IPagination = {
          totalItems: paging.totalItems,
          page: paging.page,
          size: paging.size,
          totalPages: paging.totalPages
        }

        this.bPagination.next(paginationParams);
        this.orders = data;
      })
    )
  }

  handlePageEvent(event: PageEvent) {
    const currentPagination =  this.bPagination.getValue();
    currentPagination.page = event.pageIndex + 1;
    currentPagination.size = event.pageSize;

    this.bPagination.next(currentPagination);
  }

  showDetail(order: TOrderModel) {
    this.router.navigate(['/khach-hang/order-history', order._id]);
  }

}
