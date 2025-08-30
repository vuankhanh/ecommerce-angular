import { Component, Input, OnInit, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

const totalNumberOfStars = 5;
@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() ratingValue = 0;
  @Input() showRatingTitle?: boolean;
  
  ratingValueFloor = 0;
  totalNumberOfStars = Array(totalNumberOfStars).fill(null).map((value, index)=>index+1);
  ratingTitle?: string;

  ngOnInit(): void {
    this.ratingValueFloor = Math.floor(this.ratingValue);
  }

}
