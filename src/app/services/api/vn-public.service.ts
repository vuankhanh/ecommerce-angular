import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IDistrict, IProvince, IWard } from '../../models/vn-public-apis.interface';
import { ISuccess } from '../../models/success.interface';

@Injectable({
  providedIn: 'root'
})
export class VnPublicService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = environment.backendApi + '/vn-public-apis';

  getProvinces() {
    return this.httpClient.get<IProvinceResponse>(this.url + '/provinces').pipe(
      map(res => res.metaData.data)
    );
  }

  getDistricts(provinceCode: string) {
    return this.httpClient.get<IDistrictResponse>(this.url + '/districts?provinceCode=' + provinceCode).pipe(
      map(res => res.metaData.data)
    );
  }

  getWards(districtCode: string) {
    return this.httpClient.get<IDistrictResponse>(this.url + '/wards?districtCode=' + districtCode).pipe(
      map(res => res.metaData.data)
    );
  }
}

export interface IProvinceResponse extends ISuccess {
  metaData: {
    nItems: number; // Number of items in the response
    nPages: number; // Number of pages in the response
    data: IProvince[]; // Array of provinces
  }
}

export interface IDistrictResponse extends ISuccess {
  metaData: {
    nItems: number; // Number of items in the response
    nPages: number; // Number of pages in the response
    data: IDistrict[]; // Array of districts
  }
}

export interface IWardResponse extends ISuccess {
  metaData: {
    nItems: number; // Number of items in the response
    nPages: number; // Number of pages in the response
    data: IWard[]; // Array of wards
  }
}