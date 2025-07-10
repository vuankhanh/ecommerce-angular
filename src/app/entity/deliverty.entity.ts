import { IAddress, IDelivery } from "../models/address.interface";

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