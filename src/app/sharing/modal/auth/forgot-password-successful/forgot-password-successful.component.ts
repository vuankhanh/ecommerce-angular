import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password-successful',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './forgot-password-successful.component.html',
  styleUrls: ['./forgot-password-successful.component.scss']
})
export class ForgotPasswordSuccessfulComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
