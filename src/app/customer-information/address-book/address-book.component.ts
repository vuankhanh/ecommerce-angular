import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { DeliveryService } from '../../services/api/delivery.service';
import { map, Observable } from 'rxjs';
import { TDeliveryModel } from '../../models/address.interface';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    MaterialModule
  ],
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent{
  deliverys$: Observable<TDeliveryModel[]> = this.deliveryService.get().pipe(
    map(response => response.data)
  )
  constructor(
    private deliveryService: DeliveryService,
  ) { }
}
