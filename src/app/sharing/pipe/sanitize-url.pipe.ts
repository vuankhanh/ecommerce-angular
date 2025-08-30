import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'sanitizeUrl'
})
export class SanitizeUrlPipe implements PipeTransform {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
