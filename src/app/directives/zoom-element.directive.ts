import { AfterViewInit, Directive, ElementRef, HostListener, ViewChildren } from '@angular/core';
import { AppServicesService } from '../services/app-services.service';

const lensHorizontalEdge = 150;
const lensVerticalEdge = 150;
const resultHorizontalEdge = 500;
const resultVerticalEdge = 500;

@Directive({
  selector: '[appZoomElement]'
})
export class ZoomElementDirective implements AfterViewInit {
  img: HTMLImageElement;
  lens: HTMLDivElement;
  result: HTMLDivElement;
  cx:number;
  cy: number;
  constructor(
    private element: ElementRef,
    private appServiceService: AppServicesService
  ) {}

  ngAfterViewInit(): void {
    this.appServiceService.checkScreenWidthSize$.subscribe(res=>{
      if(res==='full'){
        this.element.nativeElement.onload = (e: Event)=>{
          let target: HTMLImageElement = e.target as HTMLImageElement;
          this.img = target;
    
          this.createLens(this.img);
          this.createResult(this.img);
          
          this.lens = <HTMLDivElement>document.getElementById('imgZoomLens');
          this.result = <HTMLDivElement>document.getElementById('imgZoomResult');
      
          this.cx = resultHorizontalEdge / lensHorizontalEdge;
          this.cy = resultVerticalEdge / lensVerticalEdge;
          
          /*set background properties for the result DIV:*/
          this.result.style.backgroundImage = "url('" + this.img.src + "')";
          let sum = (this.img.width * this.cx) + "px " + (this.img.width * this.cy) + "px"
      
          this.result.style.backgroundSize = sum;
          
          if(this.lens && this.result){
            let getCursorPos = (e: MouseEvent, element: HTMLImageElement)=>{
              var a, x = 0, y = 0;
              e = e || window.event;
              /*get the x and y positions of the image:*/
              a = element.getBoundingClientRect();
              /*calculate the cursor's x and y coordinates, relative to the image:*/
              x = e.pageX - a.left;
              y = e.pageY - a.top;
              /*consider any page scrolling:*/
              x = x - window.pageXOffset;
              y = y - window.pageYOffset;
              return {x, y};
            }
      
            let moveLens = (e: MouseEvent)=>{
              this.lens.style.display = 'block';
              this.result.style.display = 'block';
          
              let cx = this.result.offsetWidth / this.lens.offsetWidth;
              let cy = this.result.offsetHeight / this.lens.offsetHeight;
              
              var pos, x, y;
              /*prevent any other actions that may occur when moving over the image:*/
              e.preventDefault();
              /*get the cursor's x and y positions:*/
              pos = getCursorPos(e, this.img);
              /*calculate the position of the lens:*/
              x = pos.x - (this.lens.offsetWidth / 2);
              y = pos.y - (this.lens.offsetHeight / 2);
              /*prevent the lens from being positioned outside the image:*/
              if (x > this.img.width - this.lens.offsetWidth) {x = this.img.width - this.lens.offsetWidth;}
              if (x < 0) {x = 0;}
              if (y > this.img.height - this.lens.offsetHeight) {y = this.img.height - this.lens.offsetHeight;}
              if (y < 0) {y = 0;}
              /*set the position of the lens:*/
              this.lens.style.left = x + "px";
              this.lens.style.top = y + "px";
              /*display what the lens "sees":*/
              this.result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
            }
      
            this.lens.addEventListener("mousemove", moveLens);
            this.img.addEventListener("mousemove", moveLens);
            
            // /*initialise and hide lens result*/
            this.result.style.display = "none";
            
            // /*Reveal and hide on mouseover or out*/
            this.lens.onmouseover = ()=>{
              this.lens.style.display = "block";
              this.result.style.display = "block";
            };
            this.lens.onmouseout = ()=>{
              this.lens.style.display = "none";
              this.result.style.display = "none";
            };
          }
        }
      }
    })
  }

  createLens(img: HTMLImageElement, ){
    if(this.lens){
      this.lens.remove();
    }
    let lens = <HTMLDivElement>document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    lens.id = "imgZoomLens";
    lens.style.zIndex = "2";
    lens.style.position = "absolute";
    lens.style.border = "1px solid #d4d4d4";
    lens.style.width = lensHorizontalEdge + "px";
    lens.style.height = lensVerticalEdge + "px";
    lens.style.left = 0+'px';
    lens.style.top = 0+'px';
    lens.style.display = 'none';

    img.parentElement?.appendChild(lens);
  }

  createResult(img: HTMLImageElement){
    if(this.result){
      this.result.remove();
    }
    let result = <HTMLDivElement>document.createElement("DIV");
    result.setAttribute("class", "img-zoom-result");
    result.id = "imgZoomResult";
    result.style.zIndex = "2";
    result.style.position = "absolute";
    result.style.border = "1px solid #d4d4d4";
    result.style.width = resultHorizontalEdge + "px";
    result.style.height = resultVerticalEdge + "px";
    result.style.right = -(resultHorizontalEdge+45)+'px';
    result.style.top = 0+'px';

    img.parentElement?.appendChild(result);
  }

  
}
