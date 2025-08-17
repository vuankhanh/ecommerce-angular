import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../module/material';
import { DeliveryPersonalApiService } from '../../../services/api/personal/delivery-personal.api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDelivery, TDeliveryModel } from '../../../models/address.interface';
import { FormsModule } from '@angular/forms';
import { filter, lastValueFrom, Subscription, switchMap, take } from 'rxjs';
import { DeliveryComponent } from '../delivery/delivery.component';

@Component({
  selector: 'app-delivery-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MaterialModule
  ],
  templateUrl: './delivery-selection.component.html',
  styleUrl: './delivery-selection.component.scss'
})
export class DeliverySelectionComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<DeliverySelectionComponent>);
  private readonly deliveryPersonalApiService: DeliveryPersonalApiService = inject(DeliveryPersonalApiService);

  deliverys: TDeliveryModel[] = [];
  selectedDeliveryId: string | null = inject<string | null>(MAT_DIALOG_DATA);;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.deliveryPersonalApiService.getAllData().subscribe((deliveries: TDeliveryModel[]) => {
        this.deliverys = deliveries;
        if (this.deliverys.length > 0 && !this.selectedDeliveryId) {
          const defaultDelivery = this.deliverys.find(delivery => delivery.isDefault);
          this.selectedDeliveryId = defaultDelivery ? defaultDelivery._id : this.deliverys[0]._id;
        }
      })
    )
  }

  onCreateAddress() {
    this.subscription.add(
      this._dialog.open(DeliveryComponent, {
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
          return this._dialog.open(DeliveryComponent, {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  async confirm() {
    if (!this.selectedDeliveryId) {
      return;
    }
    const delivery = await lastValueFrom(this.deliveryPersonalApiService.getDetail(this.selectedDeliveryId!).pipe(
      take(1)
    ));

    this.dialogRef.close(delivery);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
