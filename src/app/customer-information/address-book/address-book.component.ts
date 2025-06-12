import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmActionComponent } from 'src/app/sharing/modal/confirm-action/confirm-action.component';

//Model
import { Address } from '../../models/Address';

import { CustomerAddressService, ResponseAddress } from 'src/app/services/api/customer-address.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ResponseLogin } from 'src/app/services/api/login.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddressModificationService } from 'src/app/services/address-modification.service';

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  addresses: Array<Address>;
  constructor(
    private dialog: MatDialog,
    private customerAddressService: CustomerAddressService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    public addressModificationService: AddressModificationService
  ) { }

  ngOnInit(): void {
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

  updateAddress(address: Address){
    this.subscription.add(
      this.addressModificationService.openAddressModification('update', address).subscribe(res=>{
        if(res){
          let responseAddress: ResponseAddress = res;
          this.addresses = responseAddress.address;
        }
      })
    )
  }

  deleteAddress(address: Address){
    const dialogRef = this.dialog.open(ConfirmActionComponent,{
      panelClass: 'confirm-modal',
      data: 'Bạn chắc chắn xóa?'
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
        if(tokenStoraged){
          this.customerAddressService.remove(tokenStoraged.accessToken, address).subscribe(res=>{
            if(res){
              let responseAddress: ResponseAddress = res;
              this.addresses = responseAddress.address;
              this.toastService.shortToastSuccess('Đã xóa địa chỉ thành công', 'Thành công');
            }
          },error=>{
            this.toastService.shortToastError('Đã có lỗi xảy ra', 'Thất bại');
          })
        }
      }
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
