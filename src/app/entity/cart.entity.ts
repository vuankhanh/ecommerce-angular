import { ICart, ICartItem } from "../models/cart.interface";
import { ProductDetailEntity } from "./product-detail.entity";

export class CartItemEntity implements ICartItem {
  product: ProductDetailEntity;
  quantity: number;
  
  constructor(productDetailEntity: ProductDetailEntity) {
    this.product = productDetailEntity;
    this.quantity = productDetailEntity.quantity || 1; // Default quantity to 1 if not set
  }
}

export class CartEntity implements ICart {
  cartItems: CartItemEntity[];
  totalValue = 0;
  totalQuantity = 0;

  constructor(cartItems: CartItemEntity[]) {
    this.cartItems = cartItems;
    this.calculateTotalValue();
    this.calculateTotalQuantity();
  }

  addItem(cartItemEntity: CartItemEntity) {
    const index = this.cartItems.findIndex((cartItem: CartItemEntity) => cartItem.product._id === cartItemEntity.product._id);
    if (index < 0) {
      this.cartItems.push(cartItemEntity);
    }else {
      this.cartItems[index].quantity += cartItemEntity.quantity;
    }

    this.calculateTotalValue();
    this.calculateTotalQuantity();
  }

  changeQuantity(cartItemEntity: CartItemEntity, quantity: number) {
    const index = this.cartItems.findIndex((cartItem: CartItemEntity) => cartItem.product._id === cartItemEntity.product._id);
    quantity = quantity || 1; // Default to 1 if quantity is not provided
    if (index !== -1) {
      this.cartItems[index].quantity = quantity;
      this.calculateTotalValue();
      this.calculateTotalQuantity();
    }else {
      throw new Error("Không tim thấy sản phẩm trong giỏ hàng");
    }
  }

  removeItem(cartItemEntity: CartItemEntity) {
    this.cartItems = this.cartItems.filter(item => item.product._id !== cartItemEntity.product._id);
    this.calculateTotalValue();
    this.calculateTotalQuantity();
  }

  resetCart() {
    this.cartItems = [];
    this.totalValue = 0;
    this.totalQuantity = 0;
  }
  
  private calculateTotalValue() {
    this.totalValue = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  private calculateTotalQuantity() {
    this.totalQuantity = this.cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
}