import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private showAlertAddedToCart: boolean = false;
  private listenShowAlertAddedToCart$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.showAlertAddedToCart);
  constructor() { }

  get(){
    return this.listenShowAlertAddedToCart$.asObservable();
  }

  set(status: boolean){
    this.showAlertAddedToCart = status;
    this.listenShowAlertAddedToCart$.next(this.showAlertAddedToCart);
  }
}
