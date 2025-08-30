import { Component, inject } from '@angular/core';

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
export class AlertTitleComponent {
  private readonly _bottomSheetRef: MatBottomSheetRef<AlertTitleComponent> = inject(MatBottomSheetRef<AlertTitleComponent>);

  close(): void {
    this._bottomSheetRef.dismiss();
  }
}
