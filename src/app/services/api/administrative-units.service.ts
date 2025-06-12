import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Province, District, Ward } from '../../models/Address';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdministrativeUnitsService {
  private urlAdministrativeUnits: string = environment.backendApi+'/administrative-units';
  constructor(
    private httpClient: HttpClient
  ) { }

  getProvince(){
    let params = new HttpParams().set('province', 'all');

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<Array<Province>>(this.urlAdministrativeUnits, { headers, params });
  }

  getDistrict(provinceCode: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<Array<District>>(this.urlAdministrativeUnits+"/"+provinceCode+'/district', { headers: headers });
  }

  getWard(districtCode: string){
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.get<Array<Ward>>(this.urlAdministrativeUnits+"/"+districtCode+'/ward', { headers: headers });
  }
}
