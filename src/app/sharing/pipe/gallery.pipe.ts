import { inject, Pipe, PipeTransform } from '@angular/core';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { PrefixBackendStaticPipe } from './prefix-backend.pipe';
import { TMediaModel } from '../../models/album.interface';
import { isArray } from 'lodash';

@Pipe({
  name: 'gallery',
  standalone: true
})
export class GalleryPipe implements PipeTransform {
  private readonly prefixBackendStaticPipe: PrefixBackendStaticPipe = inject(PrefixBackendStaticPipe);

  transform(media: TMediaModel[]): GalleryItem[] {
    if (!media || !isArray(media)) {
      return [];
    }
    
    const galleries: GalleryItem[] = media.map((media: TMediaModel) => {
      const src = this.prefixBackendStaticPipe.transform(media.url);
      const thumbSrc = this.prefixBackendStaticPipe.transform(media.thumbnailUrl);
      const galleryItem: GalleryItem = {
        src: src,
        thumbSrc: thumbSrc,
        description: media.description,
        alt: media.alternateName,
        video: media.type === 'video'
      }
      return galleryItem;
    });

    return galleries;
  }

}
