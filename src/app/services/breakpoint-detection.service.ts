import { inject, Injectable } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';

import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointDetectionService {
  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  detection$(){
    return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).pipe(
      map((state: BreakpointState) => state.matches)
    )
  }
}
