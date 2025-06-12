import { Directive, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }
  
  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let targetId = target.id;
    
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside || targetId === "closeAlertAddedToCart") {
      this.clickOutside.emit();
    }
  }
}
