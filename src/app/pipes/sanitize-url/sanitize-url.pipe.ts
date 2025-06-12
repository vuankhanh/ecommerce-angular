import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl'
})
export class SanitizeUrlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {

  }
  transform(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
