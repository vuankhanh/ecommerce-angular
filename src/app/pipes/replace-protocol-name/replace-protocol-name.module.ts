import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplaceProtocolNamePipe } from './replace-protocol-name.pipe'; 

@NgModule({
  declarations: [ReplaceProtocolNamePipe],
  imports: [
    CommonModule
  ],exports: [ReplaceProtocolNamePipe]
})
export class ReplaceProtocolNameModule { }
