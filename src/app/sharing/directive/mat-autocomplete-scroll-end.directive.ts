import { AfterViewInit, Directive, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMatAutocompleteScrollEnd]',
  standalone: true
})
export class MatAutocompleteScrollEndDirective implements AfterViewInit, OnDestroy {
  private readonly matAutocompleteTrigger: MatAutocompleteTrigger | null = inject(MatAutocompleteTrigger, { host: true, optional: true });
  @Output() scrolledToBottom = new EventEmitter<void>();
  private panel: HTMLElement | null = null;
  private readonly subscription = new Subscription();

  ngAfterViewInit() {
    if (!this.matAutocompleteTrigger) {
      return;
    }
    this.subscription.add(
      this.matAutocompleteTrigger.autocomplete.opened.subscribe(() => {
        setTimeout(() => {
          this.panel = this.matAutocompleteTrigger?.autocomplete.panel?.nativeElement;
          if (this.panel) {
            this.panel.addEventListener('scroll', this.onScroll);
          }
        });
      })
    );

    this.subscription.add(
      this.matAutocompleteTrigger.panelClosingActions.subscribe(() => {
        this.removeScrollListener();
      })
    );
  }

  ngOnDestroy() {
    this.removeScrollListener();
    this.subscription.unsubscribe();
  }

  private onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      this.scrolledToBottom.emit();
    }
  };

  private removeScrollListener() {
    if (this.panel) {
      this.panel.removeEventListener('scroll', this.onScroll);
      this.panel = null;
    }
  }
}
