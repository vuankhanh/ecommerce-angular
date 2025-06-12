import { Directive, ElementRef, HostListener } from '@angular/core';

import { GetAverageRgbService } from '../services/get-average-rgb.service';

@Directive({
  selector: '[appSetBackgroundParentElementColor]'
})
export class SetBackgroundParentElementColorDirective {
  imgElement: HTMLImageElement;

  constructor(
    public el: ElementRef,
    private getAverageRgbService: GetAverageRgbService
  ) {
    this.imgElement = this.el.nativeElement;
  }

  @HostListener('load', ['$event'])
  onLoad(){
    let parentImgElement = this.imgElement.parentElement as HTMLDivElement ;

    if(parentImgElement){
      let color = this.getAverageRgbService.getAverageRGB(this.imgElement);
      if(parentImgElement){
        let cssColor = "rgb(+"+color.r+","+color.g+","+color.b+")";
        parentImgElement.setAttribute("style", "background-color: "+cssColor+";")
      }
    }
  }
}
