import { IDelivery } from "../models/address.interface";
import { IAddress } from "../models/vn-public-apis.interface";

export class DeliveryEntity implements IDelivery {
  name: string;
  phoneNumber: string;
  address: IAddress;

  constructor(delivery: IDelivery) {
    this.name = delivery.name;
    this.phoneNumber = delivery.phoneNumber;
    this.address = delivery.address
  }
}