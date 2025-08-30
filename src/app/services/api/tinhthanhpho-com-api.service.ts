import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ISuccess } from '../../models/success.interface';
import { IDistrict, IProvince, IWard } from '../../models/tinhthanhpho_com_api.interface';
import { map } from 'rxjs';
import { IPagination } from '../../models/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class TinhthanhphoComApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = environment.backendApi + '/tinhthanhpho-com-api/v1';

  getProvinces(
    keyword?: string,
    limit?: number,
    page?: number
  ) {
    let params: HttpParams = new HttpParams();
    if (keyword) params = params.append('keyword', keyword);
    if (limit != null) params = params.append('limit', limit);
    if (page != null) params = params.append('page', page);
    return this.httpClient.get<ITinhthanhphoResponse<IProvince[]>>(this.url + '/provinces', { params }).pipe(
      map(res => res.metaData)
    );
  }

  getDistricts(
    provinceCode: string,
    keyword?: string,
    limit?: number,
    page?: number
  ) {
    let params: HttpParams = new HttpParams();
    params = params.append('provinceCode', provinceCode);
    if (keyword) params = params.append('keyword', keyword);
    if (limit != null) params = params.append('limit', limit);
    if (page != null) params = params.append('page', page);
    return this.httpClient.get<ITinhthanhphoResponse<IDistrict[]>>(this.url + '/districts', { params }).pipe(
      map(res => res.metaData)
    );
  }

  getWards(
    districtCode: string,
    keyword?: string,
    limit?: number,
    page?: number
  ) {
    let params: HttpParams = new HttpParams();
    params = params.append('districtCode', districtCode);
    if (keyword) params = params.append('keyword', keyword);
    if (limit != null) params = params.append('limit', limit);
    if (page != null) params = params.append('page', page);
    return this.httpClient.get<ITinhthanhphoResponse<IWard[]>>(this.url + '/wards', { params }).pipe(
      map(res => res.metaData)
    );
  }
}

export type TAddressMetaData<T extends IProvince[] | IDistrict[] | IWard[]> = {
  data: T;
  paging: IPagination;
}

export interface ITinhthanhphoResponse<T extends IProvince[] | IDistrict[] | IWard[]> extends ISuccess {
  metaData: TAddressMetaData<T>;
}