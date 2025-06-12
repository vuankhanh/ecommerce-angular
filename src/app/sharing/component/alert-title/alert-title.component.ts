import { Component, OnInit } from '@angular/core';

import { MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-alert-title',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule
  ],
  templateUrl: './alert-title.component.html',
  styleUrls: ['./alert-title.component.scss']
})
export class AlertTitleComponent implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AlertTitleComponent>
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this._bottomSheetRef.dismiss();
  }
}
