import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AddressChooseComponent } from '../../sharing/modal/address-choose/address-choose.component';
import { PaymentSuccessfulComponent } from '../../sharing/modal/payment-successful/payment-successful.component';

import { Address } from 'src/app/models/Address';
import { Product } from 'src/app/models/Product';
import { UserInformation } from 'src/app/models/UserInformation';

import { AuthService } from 'src/app/services/auth.service';
import { Cart, CartService } from 'src/app/services/cart.service';
import { AddressModificationService } from 'src/app/services/address-modification.service';
import { OrderService } from 'src/app/services/api/order.service';
import { ResponseLogin } from 'src/app/services/api/login.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { CartApiService } from 'src/app/services/api/cart-api.service';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { AddressModifyComponent } from 'src/app/sharing/modal/address-modify/address-modify.component';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  @ViewChild('btnInsertAddress') btnInsertAddress: ElementRef;

  displayedColumns: string[] = ['numericalOrder', 'thumbnail', 'name', 'price', 'quantity'];
  cart: Cart;
  totalBill: number = 0;

  estimateFeeInfo: any = null;
  estimateFeeError: any;
  
  userInformation: UserInformation | null;
  defaultAddress: Address;
  temporaryValue: number = 0;
  
  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private renderer2: Renderer2,
    private cartService: CartService,
    private authService: AuthService,
    private addressModificationService: AddressModificationService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private cartApiService: CartApiService,
  ) { }

  ngOnInit(): void {
    const cartChange$ = this.cartService.listenCartChange();
    const userInformation$ = this.authService.getUserInformation();

    this.subscription.add(
      combineLatest([cartChange$, userInformation$]).subscribe(([cart, userInfo])=>{
        if(cart){
          this.cart = cart;
          this.temporaryValue = this.cartService.sumTemporaryValue(this.cart.products);
  
          if(this.cart.products.length>0){
            this.cartApiService.getTotalBill(this.cart.products).subscribe(res=>{
              this.totalBill = res.totalBill;
            },error=>{
              this.totalBill = 0;
            })
          }
          
          if(this.cart.deliverTo){
            this.defaultAddress = this.cart.deliverTo;
          }
        }

        if(userInfo){
          this.userInformation = userInfo;
        }

        if(userInfo && this.cart.deliverTo && this.cart.products.length>0){
          let tokenStoraged = this.localStorageService.get(this.localStorageService.tokenStoragedKey);
          if(tokenStoraged && tokenStoraged.accessToken){
            let estimateFee$ = this.cartApiService.getEstimateFee(tokenStoraged.accessToken, this.cart.deliverTo._id!, this.cart.products);
            this.subscription.add(
              estimateFee$.subscribe(res=>{
                if(res){
                  this.estimateFeeInfo = res;
                  this.estimateFeeError = null;
                }
              }, error=>{
                this.estimateFeeInfo = null;
                this.estimateFeeError = {
                  desc: 'AhaMove hiện tại không hỗ trợ vận chuyển đến địa chỉ của bạn vì thế Carota sẽ liên hệ với bạn và chuẩn bị một hình thức vận chuyển khác.'
                }
                // if(error.status === 406){
                //   if(error.error.code === 'INVALID_DISTANCE'){
                //     this.estimateFeeError = {
                //       desc: 'AhaMove hiện tại không hỗ trợ vận chuyển đến địa của bạn vì thế Carota sẽ liên hệ với bạn và chuẩn bị một hình thức vận chuyển khác.'
                //     }
                //   }
                // }
              })
            )
          }
        }
      })
    );
  }

  showDetail(product: Product){
    this.router.navigate(['san-pham/'+product.category.route, product._id]);
  }

  changeAddress(){
    this.dialog.open(AddressChooseComponent, {
      panelClass: 'address-choose',
      data: {
        defaultAddress: this.defaultAddress
      }
    }).afterClosed().subscribe(res=>{
      if(res && res.deliverTo){
        let address: Address = res.deliverTo;
        this.defaultAddress = address;
        this.cartService.setDelivery(this.defaultAddress);
      }
    })
  }

  insertAddress(){
    this.renderer2.removeClass(this.btnInsertAddress.nativeElement, 'button-substyle');
    this.addressModificationService.openAddressModification('insert', null)
  }

  confirmPayment(){
    if(this.userInformation){
      let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
      if(tokenStoraged && tokenStoraged.accessToken){
        this.subscription.add(
          this.orderService.insert(tokenStoraged.accessToken, this.cart).subscribe(async order=>{
            await this.router.navigate(['/san-pham']);
            this.cartService.resetProduct();
            this.dialog.open(PaymentSuccessfulComponent,
              {
                panelClass: 'payment-success-modal',
                data: { isLoyalCustomer: true, order },
                autoFocus: false
              }
            ).afterClosed().subscribe(res=>{
              let result: 'goProduct' | 'goOrderHistory' = res;
              if(result === 'goOrderHistory'){
                this.router.navigate(['/customer/order-history']);
              }
            })
          },error=>{
            this.toastService.shortToastError(error.error.message, 'Đã có lỗi xảy ra');
          })
        )
      }
    }else{
      this.subscription.add(
        this.orderService.insertFromVitors(this.cart).subscribe(async order=>{
          await this.router.navigate(['/san-pham']);
          this.cartService.resetProduct();
          this.dialog.open(PaymentSuccessfulComponent,
            {
              panelClass: 'payment-success-modal',
              data: { isLoyalCustomer: false, order },
              autoFocus: false
            }
          )
        },error=>{
          this.toastService.shortToastError(error.error.message, 'Đã có lỗi xảy ra');
        })
      )
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
