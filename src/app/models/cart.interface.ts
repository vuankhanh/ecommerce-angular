import { ProductDetailEntity } from "../entity/product-detail.entity";

export interface ICartItem {
  product: ProductDetailEntity;
  quantity: number;
}

export interface ICart {
  cartItems: ICartItem[];
  totalValue: number;
  totalQuantity: number;
}