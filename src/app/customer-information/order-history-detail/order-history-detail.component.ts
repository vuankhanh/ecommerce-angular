import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../../models/Order';
import { TToken } from '../../models/token.interface';
import { OrderService } from '../../services/api/order.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-order-history-detail',
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.scss']
})
export class OrderHistoryDetailComponent implements OnInit, OnDestroy {
  orderId: string;

  order?: Order;

  displayedColumns: string[] = ['name', 'price', 'quantity'];

  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private localStorageService: LocalStorageService
  ) {
    this.orderId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.listenOrderHistoryDetail(this.orderId);
  }

  listenOrderHistoryDetail(orderId: string){
    let tokenStoraged: TToken = <TToken>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged && tokenStoraged.accessToken){
      this.subscription.add(
        this.orderService.getDetail(tokenStoraged.accessToken, orderId).subscribe(res=>{
          this.order = res;
          
        })
      )
    }
  }

  showDetail(product: Product){
    this.router.navigate(['san-pham/'+product.category.route, product._id]);
  }

  revoke(id: string){
    let tokenStoraged: TToken = <TToken>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged && tokenStoraged.accessToken && this.order?._id != 'revoke'){
      this.subscription.add(
        this.orderService.revoke(tokenStoraged.accessToken, id).subscribe(res=>{
          this.order = res;
        })
      )
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
