import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
@Pipe({
  name: 'galleryRoute',
  standalone: true
})
export class GalleryRoutePipe implements PipeTransform {
  private backendStatic: string = environment.backendStatic;
  transform(value: unknown, ...args: unknown[]): string {
    return this.backendStatic+'/'+value;
  }

}
