import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { SocketIoService } from './services/socket/socket-io.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment.development';
import { PrefixBackendStaticPipe } from './sharing/pipe/prefix-backend.pipe';
import { provideNgxMask } from 'ngx-mask';
import { provideIconConfig } from './sharing/provider/icon-config.provider';
import { AuthService } from './services/auth.service';
import { authInterceptor } from './sharing/core/interceptor/auth.interceptor';
import { provideAppInitializerConfig } from './sharing/provider/app-initializer.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    provideAnimationsAsync(),
    provideIconConfig(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAppInitializer(provideAppInitializerConfig()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideToastr({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    PrefixBackendStaticPipe,
    provideNgxMask()
  ]
};
