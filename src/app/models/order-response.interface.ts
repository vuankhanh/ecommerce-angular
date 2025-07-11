
import { OrderStatus } from "../sharing/constant/order.constant";
import { IDelivery } from "./address.interface";
import { ICart } from "./cart.interface";
import { IMongodbDocument } from "./mongo.interface";
import { TPaymentMethod } from "./payment.interface";

export type TOrderStatus = `${OrderStatus}`;

export interface IOrderResponse {
  customerId: string;
  orderCode: string;
  orderItems: IOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
  delivery: IDelivery;
  note: string;
}

export interface IOrderItem {
  productThumbnail: string;
  productCode: string;
  productName: string;
  quantity: number;
  price: number;
}

export type TOrderDetailResponseModel = IOrderResponse & IMongodbDocument