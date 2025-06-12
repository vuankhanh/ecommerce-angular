import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'trustYoutubeUrl'
})
export class TrustYoutubeUrlPipe implements PipeTransform {
    constructor (private domSanitizer: DomSanitizer) {}
    transform(youtubeUrl: string) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(youtubeUrl)
    }
}

@Pipe({
    name: 'youtubeEmbed'
})
export class YotubeEmbedPipe implements PipeTransform {
    transform(youtubeId: string): string {
        return 'https://www.youtube.com/embed/'+youtubeId+'?version=3&enablejsapi=1';
    }
}

@Pipe({
    name: 'youtubeThumbnail'
})
export class YoutubeThumbnailPipe implements PipeTransform {
    transform(youtubeId: string): string {
        return 'https://img.youtube.com/vi/'+youtubeId+'/0.jpg';
    }
}
