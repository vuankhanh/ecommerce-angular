import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  standalone: true,
  name: 'theDayOfWeekFormat'
})
export class TheDayOfWeekPipe implements PipeTransform {

  transform(value: Date): string {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const newDate = new Date(value);
    const day = days[newDate.getDay()];
    const date = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0');

    const hour = String(newDate.getHours()).padStart(2, '0');
    return hour + ' giờ - ' + day + ', ngày ' + date + ' tháng ' + month;
  }

}
