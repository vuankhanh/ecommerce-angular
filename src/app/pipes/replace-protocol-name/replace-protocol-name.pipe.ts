import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceProtocolName'
})
export class ReplaceProtocolNamePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if(value.startsWith('https://') || value.startsWith('http://')){
      let newName: string = value.split("//")[1];
      if(newName.startsWith('www.')){
        newName = newName.split("www.")[1];
      }
      return newName;
    }else return value;
  }

}
