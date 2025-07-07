import { TAlbumModel } from "../models/album.interface";
import { TProductCategoryModel } from "../models/product-category.interface";
import { IProductReviewModel, TProductModel } from "../models/product.interface";

export class ProductDetailEntity implements TProductModel {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  albumId?: string | undefined;
  album?: TAlbumModel | undefined;
  price: number;
  productCategoryId?: string | undefined;
  productCategory?: TProductCategoryModel | undefined;
  inStock: boolean;
  reviews?: IProductReviewModel[] | undefined;
  averageRating?: number | undefined;
  totalReviews?: number | undefined;
  
  _id: string;
  createdAt: string;
  updatedAt: string;

  quantity: number = 1;
  totalPrice: number = 0;

  constructor(
    product: TProductModel
  ) {
    this.name = product.name;
    this.slug = product.slug;
    this.description = product.description;
    this.shortDescription = product.shortDescription;
    this.albumId = product.albumId;
    this.album = product.album;
    this.price = product.price;
    this.productCategoryId = product.productCategoryId;
    this.productCategory = product.productCategory;
    this.inStock = product.inStock;
    this.reviews = product.reviews;
    this.averageRating = product.averageRating;
    this.totalReviews = product.totalReviews;
    this._id = product._id;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }

  private setTotalPrice() {
    this.totalPrice = this.price * this.quantity;
  }

  increseQuantity() {
    this.quantity++;
  }

  decreseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

}
