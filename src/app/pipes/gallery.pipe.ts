import { Pipe, PipeTransform } from '@angular/core';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { PrefixBackendStaticPipe } from './prefix-backend.pipe';
import { TAlbumModel, TMediaModel } from '../models/album.interface';

@Pipe({
  name: 'gallery',
  standalone: true
})
export class GalleryPipe implements PipeTransform {
  constructor(
    private readonly prefixBackendStaticPipe: PrefixBackendStaticPipe
  ) {

  }
  transform(value?: TAlbumModel | undefined, ...args: unknown[]): GalleryItem[] {
    if (value && value.media && value.media.length > 0) {
      const galleries: GalleryItem[] = value.media.map((media: TMediaModel) => {
        const src = this.prefixBackendStaticPipe.transform(media.url);
        const thumbSrc = this.prefixBackendStaticPipe.transform(media.thumbnailUrl);
        const galleryItem: GalleryItem = {
          src: src,
          thumbSrc: thumbSrc,
          description: media.description,
          alt: media.alternateName,
          video: media.type === 'video' ? true : false
        }
        return galleryItem;
      });

      return galleries;
    }
    return [];
  }

}
