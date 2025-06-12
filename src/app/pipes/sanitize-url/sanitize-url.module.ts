import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanitizeUrlPipe } from './sanitize-url.pipe';

@NgModule({
  declarations: [SanitizeUrlPipe],
  imports: [
    CommonModule
  ],exports: [SanitizeUrlPipe]
})
export class SanitizeUrlModule { }
