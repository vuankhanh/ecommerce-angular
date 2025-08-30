import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-thanks-for-the-review',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './thanks-for-the-review.component.html',
  styleUrls: ['./thanks-for-the-review.component.scss']
})
export class ThanksForTheReviewComponent {
  public readonly dialogRef: MatDialogRef<ThanksForTheReviewComponent> = inject(MatDialogRef<ThanksForTheReviewComponent>);
}
