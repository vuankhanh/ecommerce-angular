import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'isMain'
})
export class isMainPipe implements PipeTransform {
  transform(value: any[]): any {
    const index = value.findIndex(v=>v.isMain);
    return index >=0 ? value[index] : value[0];
  }
}