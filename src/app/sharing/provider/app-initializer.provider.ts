import { inject } from "@angular/core";
import { SocketIoService } from "../../services/socket/socket-io.service";
import { AuthService } from "../../services/auth.service";
import { DeliveryService } from "../../services/delivery.service";
import { lastValueFrom, take } from "rxjs";
import { DeliveryPersonalApiService } from "../../services/api/personal/delivery-personal.api.service";

export function provideAppInitializerConfig() {
  return async () => {
    const authService = inject(AuthService);
    const socketIoService = inject(SocketIoService);
    const deliveryService = inject(DeliveryService);
    const deliveryPersonalApiService = inject(DeliveryPersonalApiService);
    const isAuthenticated = await authService.getUserInfoFromTokenStoraged();
    if (isAuthenticated) {
      const delivery = await lastValueFrom(deliveryService.deliveryStoraged$.pipe(take(1)));
      if (!delivery) {
        const defaultDelivery = await lastValueFrom(deliveryPersonalApiService.getDefault().pipe(take(1)));
        deliveryService.setDelivery(defaultDelivery);
      }
      console.log(delivery);
    }
  };
}