import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'trustYoutubeUrl'
})
export class TrustYoutubeUrlPipe implements PipeTransform {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(youtubeUrl: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(youtubeUrl)
  }
}

@Pipe({
  standalone: true,
  name: 'youtubeEmbed'
})
export class YotubeEmbedPipe implements PipeTransform {
  transform(youtubeId: string): string {
    return 'https://www.youtube.com/embed/' + youtubeId + '?version=3&enablejsapi=1';
  }
}

@Pipe({
  standalone: true,
  name: 'youtubeThumbnail'
})
export class YoutubeThumbnailPipe implements PipeTransform {
  transform(youtubeId: string): string {
    return 'https://img.youtube.com/vi/' + youtubeId + '/0.jpg';
  }
}
