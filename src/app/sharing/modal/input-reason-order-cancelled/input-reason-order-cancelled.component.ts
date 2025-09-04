import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-reason-order-cancelled',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './input-reason-order-cancelled.component.html'
})
export class InputReasonOrderCancelledComponent {
  readonly dialogRef = inject(MatDialogRef<InputReasonOrderCancelledComponent>);
  reasonControl = new FormControl<string>('', Validators.required);
}
