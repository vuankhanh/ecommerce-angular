import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ISuccess } from '../../models/success.interface';
import { TUserInformationModel } from '../../models/user-information.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private readonly url: string = environment.backendApi + '/client/info';
  constructor(
    private httpClient: HttpClient
  ) { }

  getPersonalInfo(): Observable<TUserInformationModel> {
    return this.httpClient.get<IPersonalResponse>(this.url).pipe(
      map(response => response.metaData),
      map(userInfo => {
        userInfo.hasPassword = this.parseStringToBoolean(userInfo.hasPassword);

        console.log('userInfo', userInfo);

        return userInfo;
      })
    );
  }

  private parseStringToBoolean(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    // Fallback cho các trường hợp khác
    return Boolean(value);
  }
}

export interface IPersonalResponse extends ISuccess {
  metaData: TUserInformationModel
}