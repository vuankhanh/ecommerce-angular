import { Component, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { DeliveryService } from '../../services/api/personal/delivery.service';
import { filter, map, Subscription, switchMap } from 'rxjs';
import { IDelivery, TDeliveryModel } from '../../models/address.interface';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryComponent } from '../../sharing/modal/delivery/delivery.component';
import { ConfirmActionComponent } from '../../sharing/modal/confirm-action/confirm-action.component';
@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [
    CommonModule,

    MaterialModule
  ],
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit, OnDestroy {
  deliverys: TDeliveryModel[] = [];

  private readonly subscription = new Subscription();
  constructor(
    private deliveryService: DeliveryService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.deliveryService.get().pipe(
        map(response => response.data)
      ).subscribe((deliverys: TDeliveryModel[]) => {
        this.deliverys = deliverys;
      })
    );
  }

  onCreateAddress() {
    this.subscription.add(
      this.dialog.open(DeliveryComponent, {
        panelClass: 'delivery-modal'
      }).afterClosed().pipe(
        filter(delivery => !!delivery),
        switchMap((delivery: IDelivery) => this.deliveryService.create(delivery)),
      ).subscribe((delivery: TDeliveryModel) => {
        this.deliverys.push(delivery);
        this.deliverys = [...this.deliverys];
      })
    )
  }

  onModifyAddress(index: number, delivery: TDeliveryModel): void {
    this.subscription.add(
      this.deliveryService.getDetail(delivery._id).pipe(
        switchMap((delivery: TDeliveryModel) => {
          return this.dialog.open(DeliveryComponent, {
            panelClass: 'delivery-modal',
            data: delivery
          }).afterClosed()
        }),
        filter(deliveryResult => !!deliveryResult),
        switchMap((deliveryResult: IDelivery) => this.deliveryService.update(delivery._id, deliveryResult))
      ).subscribe((deliveryResult: TDeliveryModel) => {
        this.deliverys[index] = deliveryResult;
      })
    )
  }

  onRemoveAddress(index: number, delivery: TDeliveryModel): void {
    this.subscription.add(
      this.dialog.open(ConfirmActionComponent, {
        data: 'Bạn có chắc chắn muốn xóa địa chỉ này không?'
      }).afterClosed().pipe(
        filter(confirm => confirm),
        switchMap(() => this.deliveryService.remove(delivery._id))
      ).subscribe((delivery: TDeliveryModel) => {
        this.deliverys.splice(index, 1);
        this.deliverys = [...this.deliverys]; // Trigger change detection
      })
    )
  }

  onSetDefaultAddress(index: number, delivery: TDeliveryModel): void {
    this.subscription.add(
      this.deliveryService.setDefault(delivery._id).pipe(
      ).subscribe(_=>{
        this.deliverys.forEach((item) => item.isDefault = false);
        this.deliverys[index].isDefault = true;
        this.deliverys = [...this.deliverys]; // Trigger change detection
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
