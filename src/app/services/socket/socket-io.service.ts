import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { merge, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private readonly platformId: object = inject(PLATFORM_ID);
  private socket: any;

  connect(): void {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      import('socket.io-client').then(io => {
        this.socket = io.io(environment.socket); // Đảm bảo environment có socketUrl
      });
    }
  }

  socketStatus$(): Observable<boolean> {
    if (!this.socket) return new Observable<boolean>();
    const connect$ = fromEvent(this.socket, 'connect').pipe(map(() => true));
    const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(map(() => false));
    return merge(connect$, disconnect$);
  }
}