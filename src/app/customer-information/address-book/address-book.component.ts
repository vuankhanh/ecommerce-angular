// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';


// import { Subscription } from 'rxjs';
// import { LocalStorageService } from '../../services/local-storage.service';
// import { ToastService } from '../../services/toast.service';
// import { TToken } from '../../models/token.interface';
// import { ConfirmActionComponent } from '../../sharing/modal/confirm-action/confirm-action.component';
// import { CommonModule } from '@angular/common';
// import { MaterialModule } from '../../sharing/module/material';
// import { LocalStorageKey } from '../../sharing/constant/local_storage.constant';
// @Component({
//   selector: 'app-address-book',
//   standalone: true,
//   imports: [
//     CommonModule,

//     MaterialModule
//   ],
//   templateUrl: './address-book.component.html',
//   styleUrls: ['./address-book.component.scss']
// })
// export class AddressBookComponent implements OnInit, OnDestroy {
//   // addresses: Array<Address> = [];
//   // private readonly  subscription: Subscription = new Subscription;
//   // constructor(
//   //   private dialog: MatDialog,
//   //   private customerAddressService: CustomerAddressService,
//   //   private localStorageService: LocalStorageService,
//   //   private toastService: ToastService,
//   //   public addressModificationService: AddressModificationService
//   // ) { }

//   // ngOnInit(): void {
//   //   this.listenCustomerAddress();
//   // }

//   // listenCustomerAddress(){
//   //   let tokenStoraged: TToken = <TToken>this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
//   //   if(tokenStoraged){
//   //     this.subscription.add(
//   //       this.customerAddressService.get(tokenStoraged.accessToken).subscribe(res=>{
//   //         if(res){
//   //           let responseAddress: ResponseAddress = res;
//   //           this.addresses = responseAddress.address;
//   //         }
//   //       })
//   //     )
//   //   }
//   // }

//   // addAddress(){
//   //   this.subscription.add(
//   //     this.addressModificationService.openAddressModification('insert', null).subscribe(res=>{
//   //       if(res){
//   //         let responseAddress: ResponseAddress = res;
//   //         this.addresses = responseAddress.address;
//   //       }
//   //     })
//   //   )
//   // }

//   // updateAddress(address: Address){
//   //   this.subscription.add(
//   //     this.addressModificationService.openAddressModification('update', address).subscribe(res=>{
//   //       if(res){
//   //         let responseAddress: ResponseAddress = res;
//   //         this.addresses = responseAddress.address;
//   //       }
//   //     })
//   //   )
//   // }

//   // deleteAddress(address: Address){
//   //   const dialogRef = this.dialog.open(ConfirmActionComponent,{
//   //     panelClass: 'confirm-modal',
//   //     data: 'Bạn chắc chắn xóa?'
//   //   });

//   //   dialogRef.afterClosed().subscribe(result=>{
//   //     if(result){
//   //       let tokenStoraged: TToken = <TToken>this.localStorageService.get(LocalStorageKey.ACCESSTOKEN);
//   //       if(tokenStoraged){
//   //         this.customerAddressService.remove(tokenStoraged.accessToken, address).subscribe(res=>{
//   //           if(res){
//   //             let responseAddress: ResponseAddress = res;
//   //             this.addresses = responseAddress.address;
//   //             this.toastService.shortToastSuccess('Đã xóa địa chỉ thành công', 'Thành công');
//   //           }
//   //         },error=>{
//   //           this.toastService.shortToastError('Đã có lỗi xảy ra', 'Thất bại');
//   //         })
//   //       }
//   //     }
//   //   })
//   // }

//   // ngOnDestroy(){
//   //   this.subscription.unsubscribe()
//   // }
// }
