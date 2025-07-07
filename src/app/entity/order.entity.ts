import { IDelivery } from "../models/address.interface";
import { ICart } from "../models/cart.interface";
import { IOrder } from "../models/order.interface";
import { OrderStatus } from "../sharing/constant/order.constant";
import { CartEntity } from "./cart.entity";

export class OrderEntity implements IOrder {
  status = OrderStatus.PENDING;
  accountId?: string;
  cart: ICart;
  deliverTo: IDelivery;

  constructor(accountId: string, cart: CartEntity, deliverTo: IDelivery) {
    this.accountId = accountId;
    this.cart = cart;
    this.deliverTo = deliverTo;
  }

  changeDelivery(deliverTo: IDelivery) {
    this.deliverTo = deliverTo;
  }

  set updateAccountId(accountId: string) {
    if (!accountId) {
      throw new Error("Account ID cannot be empty");
    }
    this.accountId = accountId;
  }

}