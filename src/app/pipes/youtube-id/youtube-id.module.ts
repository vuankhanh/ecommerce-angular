import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YotubeEmbedPipe, YoutubeThumbnailPipe, TrustYoutubeUrlPipe } from './youtube-id.pipe';

@NgModule({
  declarations: [
    YotubeEmbedPipe,
    YoutubeThumbnailPipe,
    TrustYoutubeUrlPipe
  ],
  imports: [
    CommonModule
  ],exports: [
    YotubeEmbedPipe,
    YoutubeThumbnailPipe,
    TrustYoutubeUrlPipe
  ]
})
export class YoutubeIdModule { }
