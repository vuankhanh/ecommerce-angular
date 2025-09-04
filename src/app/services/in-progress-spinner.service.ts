import { inject, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { ProgressSpinnerComponent } from '../sharing/component/progress-spinner/progress-spinner.component';

@Injectable({
  providedIn: 'root'
})
export class InProgressSpinnerService {
  private readonly overlay: Overlay = inject(Overlay);
  private readonly spinnerTopRef = this.cdkSpinnerCreate();

  progressSpinnerStatus(status: boolean){
    if(status){
      if(!this.spinnerTopRef.hasAttached()){
        this.spinnerTopRef.attach(new ComponentPortal(ProgressSpinnerComponent));
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
