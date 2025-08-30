import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { getLangs } from '../../constant/lang.constant';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-lang-selector',
  imports: [
    CommonModule,

    FormsModule,

    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,

  ],
  templateUrl: './lang-selector.component.html',
  styleUrl: './lang-selector.component.scss'
})
export class LangSelectorComponent implements OnInit {
  private readonly langService = inject(LangService);
  langs = getLangs();
  currentLang = 'vi';

  ngOnInit(): void {
    this.currentLang = this.langService.getCurrentLang();
  }

  changeLanguage(lang: string){
    this.langService.setLang(lang);
  }
}
