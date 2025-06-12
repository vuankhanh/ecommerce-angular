import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './empty-cart.component.html',
  styleUrls: ['./empty-cart.component.scss']
})
export class EmptyCartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
