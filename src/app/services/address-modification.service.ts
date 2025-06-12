import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddressModifyComponent } from '../sharing/modal/address-modify/address-modify.component';

import { Address, Province, District, Ward, Position } from '../models/Address';


@Injectable({
  providedIn: 'root'
})
export class AddressModificationService {

  constructor(
    private dialog: MatDialog
  ) { }

  openAddressModification(type: 'insert' | 'update', address: Address | null){
    return this.dialog.open(AddressModifyComponent,{
      panelClass: 'address-modification-modal',
      data: {type, address}
    }).afterClosed();
  }
}
