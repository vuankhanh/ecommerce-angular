import { Directive, Output, EventEmitter, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  private readonly elementRef: ElementRef = inject(ElementRef);
  @Output() clickOutside = new EventEmitter<void>();
  
  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const targetId = target.id;
    
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside || targetId === "closeAlertAddedToCart") {
      this.clickOutside.emit();
    }
  }
}
