import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'sanitizeHtmlBinding'
})
export class SanitizeHtmlBindingPipe implements PipeTransform {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

}
