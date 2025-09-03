import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { OrderPersonalApiService } from '../../services/api/personal/order-personal.api.service';
import { TOrderDetailModel } from '../../models/order-response.interface';
import { AddressPipe } from '../../sharing/pipe/address.pipe';

import { catchError, EMPTY, filter, map, Observable, Subscription, switchMap } from 'rxjs';
import { OrderStatus, OrderStatusTransition } from '../../sharing/constant/order.constant';
import { OrderStatusTranslatePipe } from '../../sharing/pipe/order-status-translate.pipe';
import { OrderStatusColorDirective } from '../../sharing/directive/order-status-color.directive';
import { MatDialog } from '@angular/material/dialog';
import { InputReasonOrderCancelledComponent } from '../../sharing/modal/input-reason-order-cancelled/input-reason-order-cancelled.component';
import { ConfirmationDialogData } from '../../models/confirmation-dialog.interface';
import { ConfirmationDialogComponent } from '../../sharing/modal/confirmation-dialog/confirmation-dialog.component';
import { OrderPaymentMethodTranslatePipe } from '../../sharing/pipe/order-payment-method-translate.pipe';
import { LangPipe } from '../../sharing/pipe/lang.pipe';

@Component({
  selector: 'app-order-history-detail',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,
    LangPipe,
    OrderStatusTranslatePipe,
    OrderPaymentMethodTranslatePipe,

    OrderStatusColorDirective,

    MaterialModule
  ],
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.scss']
})
export class OrderHistoryDetailComponent implements OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private readonly orderPersonalApiService: OrderPersonalApiService = inject(OrderPersonalApiService);

  order$: Observable<TOrderDetailModel> = this.activatedRoute.params.pipe(
    filter(params => !!params['id']),
    map(params => params['id']),
    switchMap(id => this.orderPersonalApiService.getDetail(id)),
    catchError(() => {
      this.router.navigate(['/khach-hang/order-history']);
      return EMPTY;
    }),
  );
  nextPossiblestate$ = this.order$.pipe(
    map(order => {
      const status = order.status;
      const statuses = OrderStatusTransition[status];
      return statuses;
    }),
    filter(statuses => !!statuses && statuses.length > 0),
  )
  displayedColumns: string[] = ['name', 'price', 'quantity'];

  private readonly subscription: Subscription = new Subscription();

  cancelOrder(orderDetail: TOrderDetailModel) {
    this.subscription.add(
      this.dialog.open(InputReasonOrderCancelledComponent).afterClosed().pipe(
        filter((reason: string) => !!reason),
        switchMap((reason: string) => {
          const data: ConfirmationDialogData = {
            title: 'Xác nhận hủy đơn hàng',
            message: `Bạn có chắc chắn muốn hủy đơn hàng này không?
            
            Lý do: ${reason}`,
            confirmText: 'Hủy',
            cancelText: 'Không',
            type: 'danger'
          };

          return this.dialog.open(ConfirmationDialogComponent, {
            data
          }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.orderPersonalApiService.updateStatusOrder(orderDetail._id, OrderStatus.CANCELED, reason)),
          )
        })
      ).subscribe({
        next: () => {
          //Refresh detail
          this.router.navigate(['/khach-hang/order-history']);
        },
        error: (error) => {
          console.error('Cập nhật trạng thái đơn hàng thất bại:', error);
        },
        complete: () => {
          console.log('Cập nhật trạng thái đơn hàng hoàn tất');
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
