import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetAverageRgbService {

  getAverageRGB(imgEl: HTMLImageElement) {
    const blockSize = 5;
    const defaultRGB = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    const rgb = { r: 0, g: 0, b: 0 };

    let i = -4;
    let count = 0;
    let data;

    if (!context) {
      return defaultRGB;
    }

    const height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    const width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch {
      /* security error, img on diff domain */
      return defaultRGB;
    }

    const length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

  }


}
