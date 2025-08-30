import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'replaceProtocolName'
})
export class ReplaceProtocolNamePipe implements PipeTransform {

  transform(value: string): any {
    if(value.startsWith('https://') || value.startsWith('http://')){
      let newName = value.split("//")[1];
      if(newName.startsWith('www.')){
        newName = newName.split("www.")[1];
      }
      return newName;
    }else return value;
  }

}
