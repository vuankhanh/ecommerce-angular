import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-thanks-for-the-review',
  templateUrl: './thanks-for-the-review.component.html',
  styleUrls: ['./thanks-for-the-review.component.scss']
})
export class ThanksForTheReviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ThanksForTheReviewComponent>
  ) { }

  ngOnInit(): void {
  }

}
