import { BannerGallery } from './BannerGallery';
import { Posts } from './Posts';
import { ProductCategory } from './ProductCategory';
import { ProductGallery } from './ProductGallery';
import { ProductGalleryVideo } from './ProductGalleryVideo';

export interface Unit{
  packagingType: string,
  weightNumber: number,
  unitOfMassMeasurement: string,
}

export interface Product{
    _id: string,
    code?: string,
    name: string,
    route: string,
    category: ProductCategory,
    price: number,
    currencyUnit: string,
    unit: Unit,
    thumbnailUrl?: string,
    imgBannerUrl?: string,
    sortDescription: string,
    highlight: boolean,
    albumBanner?: BannerGallery,
    theRemainingAmount: number,
    longDescription: Posts,
    supplier?: string | null,
    albumImg?: ProductGallery,
    albumVideo?: ProductGalleryVideo | null
    createdAt?: string,
    updatedAt?: string,
    quantity?: number
  }