import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Pipe({
  name: 'prefixBackendStatic',
  standalone: true
})
export class PrefixBackendStaticPipe implements PipeTransform {
  private backendStatic: string = environment.backendStatic;
  transform(value: string): string {
    if (!value) return '';
    // Nếu là tuyệt đối thì trả về nguyên giá trị
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('/')
    ) {
      return value;
    }
    return this.backendStatic + '/' + value;
  }

}
