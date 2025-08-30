import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TAlbumModel } from '../../models/album.interface';
import { ISuccess } from '../../models/success.interface';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideShowService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly url = environment.backendApi;

  get() {
    return this.httpClient.get<IAlbumResponse>(this.url+'/slide-show').pipe(
      map(res => res.metaData)
    );
  }
}

export interface IAlbumResponse extends ISuccess {
  metaData: TAlbumModel;
}