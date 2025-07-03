import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { SocketIoService } from './services/socket/socket-io.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { PrefixBackendStaticPipe } from './pipes/prefix-backend.pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    provideAnimationsAsync(),
    provideAppInitializer((()=>{
      inject(SocketIoService);
    })),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideToastr({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    PrefixBackendStaticPipe
  ]
};
