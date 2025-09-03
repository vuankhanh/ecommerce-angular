import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MouseEventEmitService {
  private isEnter = false;
  private readonly leftPanelMouseEvent$: BehaviorSubject<boolean> = new BehaviorSubject(this.isEnter);
  private readonly leftPanelMouseEvent = this.leftPanelMouseEvent$.asObservable();

  set(isEnter: boolean){
    if(this.isEnter != isEnter){
      this.isEnter = isEnter;
      this.leftPanelMouseEvent$.next(this.isEnter);
    }
  }

  get(){
    return this.leftPanelMouseEvent;
  }

}
