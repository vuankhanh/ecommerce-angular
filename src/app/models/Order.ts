
import { Address } from "./Address";
import { Product } from "./Product";

export interface Order{
    _id: string,
    code: string,
    status: 'pending' | 'confirmed' | 'isComing' | 'done' | 'revoke',
    accountId: string,
    products: Array<Product>,
    deliverTo: Address,
    totalValue?: number,
    createdAt?: string,
    updatedAt?: string
}