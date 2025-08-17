import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progress-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <mat-progress-spinner
      mode="indeterminate"
      diameter="48"
      color="accent">
    </mat-progress-spinner>
  `
})
export class ProgressSpinnerComponent {

}
