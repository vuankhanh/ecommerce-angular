import { IDelivery } from "../../models/address.interface";
import { TPaymentMethod } from "../../models/payment.interface";

export interface IOrderCreateRequest {
  orderItems: IOrderItemsRequest[];
  paymentMethod: TPaymentMethod;
  deliveryFee: number;
  discount: number;
  note?: string;
  delivery: IDelivery;
}

export interface IOrderItemsRequest {
  productId: string;
  quantity: number;
}