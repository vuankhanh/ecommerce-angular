import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IProvinceResponse } from '../../models/vn-public-apis.interface';

@Injectable({
  providedIn: 'root'
})
export class VnPublicService {
  private readonly httpClient = inject(HttpClient);
  private readonly url: string = environment.backendApi + '/vn-public-apis';

  getProvinces() {
    return this.httpClient.get<IProvinceResponse>(this.url + '/provinces').pipe(
      map(res => res.metaData.data)
    );
  }

  getDistricts(provinceCode: string) {
    return this.httpClient.get<IProvinceResponse>(this.url + '/districts?provinceCode=' + provinceCode).pipe(
      map(res => res.metaData.data)
    );
  }

  getWards(districtCode: string) {
    return this.httpClient.get<IProvinceResponse>(this.url + '/wards?districtCode=' + districtCode).pipe(
      map(res => res.metaData.data)
    );
  }
}
