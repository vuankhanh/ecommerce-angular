import { Pipe, PipeTransform } from '@angular/core';
import { IAddress } from '../../models/vn-public-apis.interface';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: IAddress, ...args: unknown[]): unknown {
    if (value) {
      const { district, province, ward, street } = value;
      return `${street}, ${ward.name}, ${district.name}, ${province.name}`;
    }
    return null;
  }

}
