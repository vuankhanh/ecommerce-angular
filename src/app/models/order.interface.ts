
import { OrderStatus } from "../sharing/constant/order.constant";
import { IDelivery } from "./address.interface";
import { ICart } from "./cart.interface";
import { IMongodbDocument } from "./mongo.interface";


export interface IOrder {
  code?: string,
  status?: `${OrderStatus}`,
  accountId?: string,
  cart: ICart,
  deliverTo: IDelivery,
}

export type TOrderModel = IOrder & IMongodbDocument