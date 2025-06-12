import { Injectable } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UrlChangeService {
  constructor(
    private router: Router
  ) {}
  urlChange(): Observable<NavigationStart>{
    return this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      map(event => event as NavigationStart)
    );
  }
}
