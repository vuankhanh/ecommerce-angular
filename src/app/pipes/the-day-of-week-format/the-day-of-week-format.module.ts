import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheDayOfWeekPipe } from './the-day-of-week-format.pipe';

@NgModule({
  declarations: [TheDayOfWeekPipe],
  imports: [
    CommonModule
  ],exports: [TheDayOfWeekPipe]
})
export class TheDayOfWeekModule { }
