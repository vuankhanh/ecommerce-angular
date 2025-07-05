import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  standalone: true,
  name: 'theDayOfWeekFormat'
})
export class TheDayOfWeekPipe implements PipeTransform {

  transform(value: Date): string {
    let days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    let newDate = new Date(value);
    let day = days[newDate.getDay()];
    let date = String(newDate.getDate()).padStart(2, '0');
    let month = String(newDate.getMonth() + 1).padStart(2, '0');

    let hour = String(newDate.getHours()).padStart(2, '0');
    return hour + ' giờ - ' + day + ', ngày ' + date + ' tháng ' + month;
  }

}
