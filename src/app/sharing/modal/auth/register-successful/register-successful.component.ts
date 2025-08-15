import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-successful',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './register-successful.component.html',
  styleUrls: ['./register-successful.component.scss']
})
export class RegisterSuccessfulComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

}
