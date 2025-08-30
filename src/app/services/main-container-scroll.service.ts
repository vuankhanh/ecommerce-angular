import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainContainerScrollService {
  private blistenScrollTop: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  listenScrollTop$: Observable<number> = this.blistenScrollTop.asObservable();

  private blistenScrollBottom: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  listenScrollBottom$: Observable<number> = this.blistenScrollBottom.asObservable();

  private bDirectionPostion: BehaviorSubject<DirectionPostion | null> = new BehaviorSubject<DirectionPostion | null>(null);
  listenDirectionPostion$: Observable<DirectionPostion | null> = this.bDirectionPostion.asObservable();

  setPositionTop(position: number){
    return this.blistenScrollTop.next(position);
  }

  setPositionBottom(position: number){
    return this.blistenScrollBottom.next(position);
  }

  setDirectionPosition(directionPostion: DirectionPostion){
    this.bDirectionPostion.next(directionPostion)
  }

}

export interface DirectionPostion{
  direction: 'x' | 'y',
  position: number
}
