import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  @Input() quantity = 12;

  fakeArray: Array<null> = []
  constructor() { }

  ngOnInit(): void {
    const newArray = new Array(this.quantity);
    this.fakeArray = newArray.fill(null);
  }

}
