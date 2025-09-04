import { inject } from "@angular/core";
import { SocketIoService } from "../../services/socket/socket-io.service";
import { AuthService } from "../../services/auth.service";
import { DeliveryService } from "../../services/delivery.service";
import { lastValueFrom, map, take } from "rxjs";
import { DeliveryPersonalApiService } from "../../services/api/personal/delivery-personal.api.service";
import { DeliveryEntity } from "../../entity/deliverty.entity";
import { LangService } from "../../services/lang.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { isPlatformBrowser } from "@angular/common";

export function provideAppInitializerConfig() {
  return async function() {
    const langService = inject(LangService);
    const platformId = (langService as any).platformId;
    if (isPlatformBrowser(platformId)) {
      const langFromHref = langService.getLangFromHref();

      if (langFromHref) {
        const localStorageService = inject(LocalStorageService);
        const lang = localStorageService.get<string>('lang');

        if (lang && lang !== langFromHref) {
          langService.setLang(lang);
        }else{
          localStorageService.set('lang', langFromHref);
        }
      }
    }

    const authService = inject(AuthService);
    const socketIoService = inject(SocketIoService);
    socketIoService.connect();
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
        )).catch(() => null);

        if (defaultDelivery) {
          deliveryService.setDelivery(defaultDelivery);
        }
      }
    }
  };
}