import { inject } from "@angular/core";
import { SocketIoService } from "../../services/socket/socket-io.service";
import { AuthService } from "../../services/auth.service";
import { DeliveryService } from "../../services/delivery.service";
import { catchError, filter, lastValueFrom, map, of, take } from "rxjs";
import { DeliveryPersonalApiService } from "../../services/api/personal/delivery-personal.api.service";
import { DeliveryEntity } from "../../entity/deliverty.entity";
import { LangService } from "../../services/lang.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { isPlatformBrowser } from "@angular/common";

export function provideAppInitializerConfig() {
  return async () => {
    const langService = inject(LangService);
    const platformId = (langService as any).platformId;
    if (isPlatformBrowser(platformId)) {
      const langFromHref = langService.getLangFromHref();

      if (langFromHref) {
        const localStorageService = inject(LocalStorageService);
        const lang = localStorageService.get<string>('lang');

        if (!lang) {
          localStorageService.set('lang', langFromHref);
        } else {
          if (lang !== langFromHref) {
            langService.setLang(lang);
          }
        }
      }
    }

    const authService = inject(AuthService);
    const socketIoService = inject(SocketIoService);
    const deliveryService = inject(DeliveryService);
    const deliveryPersonalApiService = inject(DeliveryPersonalApiService);
    const isAuthenticated = await authService.getUserInfoFromTokenStoraged();
    if (isAuthenticated) {
      const delivery = await lastValueFrom(deliveryService.deliveryStoraged$.pipe(take(1)));

      if (!delivery) {
        const defaultDelivery = await lastValueFrom(deliveryPersonalApiService.getDefault().pipe(
          take(1),
          map((response) => {
            return new DeliveryEntity(response);
          }),
        )).catch(_ => null);

        if (defaultDelivery) {
          deliveryService.setDelivery(defaultDelivery);
        }
      }
    }
  };
}