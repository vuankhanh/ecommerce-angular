import { Component, inject} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharing/module/material';
import { PersonalService } from '../../services/api/personal/personal.api.service';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    CommonModule,

    MaterialModule
  ],
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent {
  private readonly personalService: PersonalService = inject(PersonalService);
  personal$ = this.personalService.getPersonalInfo();
}
