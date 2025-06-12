import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Address } from '../../../models/Address';

import { AuthService } from '../../../services/auth.service';
import { AddressModificationService } from '../../../services/address-modification.service';

import { Subscription } from 'rxjs';
import { ResponseLogin } from '../../../services/api/login.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CustomerAddressService, ResponseAddress } from '../../../services/api/customer-address.service';

@Component({
  selector: 'app-address-choose',
  templateUrl: './address-choose.component.html',
  styleUrls: ['./address-choose.component.scss']
})
export class AddressChooseComponent implements OnInit, OnDestroy {
  addresses: Array<Address> = [];
  addressSelected: Address = this.data.defaultAddress;

  subscription: Subscription = new Subscription();
  constructor(
    public dialogRef: MatDialogRef<AddressChooseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DefaultAddressData,
    public authService: AuthService,
    public addressModificationService: AddressModificationService,
    private localStorageService: LocalStorageService,
    private customerAddressService: CustomerAddressService
  ) {}

  ngOnInit(): void {
    // this.listenUserInformation();
    this.listenCustomerAddress();
    
  }

  listenCustomerAddress(){
    let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged){
      this.subscription.add(
        this.customerAddressService.get(tokenStoraged.accessToken).subscribe(res=>{
          if(res){
            let responseAddress: ResponseAddress = res;
            this.addresses = responseAddress.address;
            let index = this.findIndexOfObjectInArray(this.data.defaultAddress._id!, this.addresses);
            if(this.addresses[index]){
              this.addressSelected = this.addresses[index]; 
            }
          }
        })
      )
    }
  }

  addAddress(){
    this.subscription.add(
      this.addressModificationService.openAddressModification('insert', null).subscribe(res=>{
        if(res){
          let responseAddress: ResponseAddress = res;
          this.addresses = responseAddress.address;
        }
      })
    )
  }

  deliveryTo(){
    this.dialogRef.close(
      {
        deliverTo: this.addressSelected
      }
    );
  }

  findIndexOfObjectInArray(
    id: string,
    array: Array<Address>
  ){
    return array.findIndex(object=>object._id === id);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}

interface DefaultAddressData{
  defaultAddress: Address
}
