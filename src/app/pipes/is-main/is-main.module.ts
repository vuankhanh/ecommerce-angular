import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { isMainPipe } from './is-main.pipe';

@NgModule({
  declarations: [isMainPipe],
  imports: [
    CommonModule
  ],exports: [isMainPipe]
})
export class IsMainModule { }
