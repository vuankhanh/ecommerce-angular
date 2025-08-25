import { Component, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { DeliveryPersonalApiService } from '../../services/api/personal/delivery-personal.api.service';
import { filter, map, Subscription, switchMap } from 'rxjs';
import { IDelivery, TDeliveryModel } from '../../models/address.interface';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryComponent } from '../../sharing/modal/delivery/delivery.component';
import { ConfirmationDialogComponent } from '../../sharing/modal/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../models/confirmation-dialog.interface';
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
    private deliveryPersonalApiService: DeliveryPersonalApiService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.deliveryPersonalApiService.getAllData().pipe(
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
        switchMap((delivery: IDelivery) => this.deliveryPersonalApiService.create(delivery)),
      ).subscribe((delivery: TDeliveryModel) => {
        this.deliverys.push(delivery);
        this.deliverys = [...this.deliverys];
      })
    )
  }

  onModifyAddress(index: number, delivery: TDeliveryModel): void {
    this.subscription.add(
      this.deliveryPersonalApiService.getDetail(delivery._id).pipe(
        switchMap((delivery: TDeliveryModel) => {
          return this.dialog.open(DeliveryComponent, {
            panelClass: 'delivery-modal',
            data: delivery
          }).afterClosed()
        }),
        filter(deliveryResult => !!deliveryResult),
        switchMap((deliveryResult: IDelivery) => this.deliveryPersonalApiService.update(delivery._id, deliveryResult))
      ).subscribe((deliveryResult: TDeliveryModel) => {
        this.deliverys[index] = deliveryResult;
      })
    )
  }

  onRemoveAddress(index: number, delivery: TDeliveryModel): void {
    const data: ConfirmationDialogData = {
      title: $localize`:@@addressBook.confirmationDialog.title:Xác nhận xóa địa chỉ`,
      message: $localize`:@@addressBook.confirmationDialog.message:Bạn có chắc chắn muốn xóa địa chỉ "${delivery.address.street}" không?`,
      confirmText: $localize`:@@addressBook.confirmationDialog.confirmText:Có`,
      cancelText: $localize`:@@addressBook.confirmationDialog.cancelText:Không`,
      type: 'warning'
    };

    this.subscription.add(
      this.dialog.open(ConfirmationDialogComponent, {
        data
      }).afterClosed().pipe(
        filter(confirm => confirm),
        switchMap(() => this.deliveryPersonalApiService.remove(delivery._id))
      ).subscribe((delivery: TDeliveryModel) => {
        this.deliverys.splice(index, 1);
        this.deliverys = [...this.deliverys]; // Trigger change detection
      })
    )
  }

  onSetDefaultAddress(index: number, delivery: TDeliveryModel): void {
    this.subscription.add(
      this.deliveryPersonalApiService.setDefault(delivery._id).pipe(
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
