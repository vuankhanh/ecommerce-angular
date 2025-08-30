import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { GetAverageRgbService } from '../../services/get-average-rgb.service';

@Directive({
  selector: '[appSetBackgroundParentElementColor]'
})
export class SetBackgroundParentElementColorDirective {
  private readonly el: ElementRef = inject(ElementRef);
  private readonly getAverageRgbService: GetAverageRgbService = inject(GetAverageRgbService);
  imgElement: HTMLImageElement = this.el.nativeElement;

  @HostListener('load', ['$event'])
  onLoad(){
    const parentImgElement = this.imgElement.parentElement as HTMLDivElement ;

    if(parentImgElement){
      const color = this.getAverageRgbService.getAverageRGB(this.imgElement);
      if(parentImgElement){
        const cssColor = "rgb(+"+color.r+","+color.g+","+color.b+")";
        parentImgElement.setAttribute("style", "background-color: "+cssColor+";")
      }
    }
  }
}
