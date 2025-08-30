import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtDecodedService {
  jwtDecoded(token: string){
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }
}
