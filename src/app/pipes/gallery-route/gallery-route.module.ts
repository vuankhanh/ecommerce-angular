import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutePipe } from './gallery-route.pipe';

@NgModule({
  declarations: [GalleryRoutePipe],
  imports: [
    CommonModule
  ],
  providers: [GalleryRoutePipe]
  ,exports: [GalleryRoutePipe]
})
export class GalleryRouteModule { }
