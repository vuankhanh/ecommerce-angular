import { Identification } from "./Identification";

export interface OrderStatus{
    numericalOrder: number,
    code: string,
    name: string
}

export interface Rating{
    value: number,
    title: string
}

export interface ServerConfig{
    identification: Identification,
    orderStatus: Array<OrderStatus>,
    orderCreatedBy: Array<OrderStatus>,
    rating: Array<Rating>;
}