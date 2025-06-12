import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanitizeHtmlBindingPipe } from './sanitize-html-binding.pipe';

@NgModule({
  declarations: [SanitizeHtmlBindingPipe],
  imports: [
    CommonModule
  ],exports: [SanitizeHtmlBindingPipe]
})
export class SanitizeHtmlBindingModule { }
