import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplaceSpacePipe } from './replace-space.pipe';

@NgModule({
  declarations: [ReplaceSpacePipe],
  imports: [
    CommonModule
  ],exports: [ReplaceSpacePipe]
})
export class ReplaceSpaceModule { }
