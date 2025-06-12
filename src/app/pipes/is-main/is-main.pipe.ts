import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isMain'
})
export class isMainPipe implements PipeTransform {
  transform(value: Array<any>): any {
    let index: number = value.findIndex(v=>v.isMain);
    return index >=0 ? value[index] : value[0];
  }

}
