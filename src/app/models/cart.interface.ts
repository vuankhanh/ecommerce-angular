import { ProductDetailEntity } from "../entity/product-detail.entity";
import { Product } from "./Product";

export interface ICartItem {
  product: ProductDetailEntity;
  quantity: number;
}

export interface ICart {
  cartItems: Array<ICartItem>;
  totalValue: number;
  totalQuantity: number;
}