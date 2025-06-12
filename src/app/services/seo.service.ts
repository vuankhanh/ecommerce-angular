import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetaTagFacebook } from '../models/MetaTag';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(
    private title: Title, private meta: Meta
  ) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTagFacebook(metaTag: MetaTagFacebook){
    this.meta.updateTag({ property: 'og:title', content: metaTag.title });
    this.meta.updateTag({ property: 'og:image', content: metaTag.image });
    this.meta.updateTag({ property: 'og:image:alt', content: metaTag.imageAlt });
    this.meta.updateTag({ property: 'og:image:type', content: metaTag.imageType });
    this.meta.updateTag({ property: 'og:image:width', content: metaTag.imageWidth });
    this.meta.updateTag({ property: 'og:image:height', content: metaTag.imageHeight });
    this.meta.updateTag({ property: 'og:url', content: metaTag.url });
    this.meta.updateTag({ property: 'og:description', content: metaTag.description });

    this.meta.updateTag({ property: 'product:brand', content: metaTag.productBrand });
    this.meta.updateTag({ property: 'product:availability', content: metaTag.productAvailability });
    this.meta.updateTag({ property: 'product:condition', content: metaTag.productCondition });
    this.meta.updateTag({ property: 'product:price:amount', content: metaTag.productPriceAmount });
    this.meta.updateTag({ property: 'product:price:currency', content: metaTag.productPriceCurrency });
    this.meta.updateTag({ property: 'product:retailer_item_id', content: metaTag.productRetailerItemId });
    this.meta.updateTag({ property: 'product:item_group_id', content: metaTag.productItemGroupId });
    this.meta.updateTag({ property: 'product:category', content: metaTag.googleProductCategory });
  }
  
}
