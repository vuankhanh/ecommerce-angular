import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class InProgressSpinnerService {
  private spinnerTopRef = this.cdkSpinnerCreate();
  constructor(
    private overlay: Overlay
  ) {

  }

  progressSpinnerStatus(status: boolean){
    if(status){
      if(!this.spinnerTopRef.hasAttached()){
        this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
      }
    }else{
      if(this.spinnerTopRef.hasAttached()){
        this.spinnerTopRef.detach();
      }
    }
  }

  private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    })
  }
}
