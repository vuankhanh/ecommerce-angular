import { inject, Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UrlChangeService {
  private readonly router: Router = inject(Router);

  urlChange(): Observable<NavigationStart>{
    return this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      map(event => event as NavigationStart)
    );
  }
}
