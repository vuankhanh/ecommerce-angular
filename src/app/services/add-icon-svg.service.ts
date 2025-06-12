import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class AddIconSvgService {
  private urlSvgs = [
    'assets/logo/svg/carota.svg',
    'assets/logo/svg/gmap.svg',
    'assets/logo/svg/star.svg',
    'assets/logo/svg/facebook.svg',
    'assets/logo/svg/messenger.svg',
    'assets/logo/svg/google-plus.svg',
    'assets/logo/svg/zalo.svg',
    'assets/logo/svg/zalo-new.svg',
    'assets/logo/svg/lock-reset',
    'assets/logo/svg/empty-cart.svg',
    'assets/logo/svg/discount.svg',
    'assets/logo/svg/supporter.svg',
  ];
  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  public addIcon(){
    for(let i=0; i<this.urlSvgs.length; i++){
      this.matIconRegistry.addSvgIcon(this.getNameSvg(this.urlSvgs[i]), this.sanitizer.bypassSecurityTrustResourceUrl(this.urlSvgs[i]));
    }
  }

  private getNameSvg(urlSvg: string){
    let splitUrl = urlSvg.split("/");
    return splitUrl[splitUrl.length-1].split(".")[0];
  }
}
