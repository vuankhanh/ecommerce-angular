import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private toastrService: ToastrService
  ) { }

  shortToastSuccess(message:string, title:string){
    return this.toastrService.success(message, title,{
      timeOut: 3000
    });
  };

  shortToastWarning(message:string, title:string){
    return this.toastrService.warning(message, title,{
      timeOut: 4000
    })
  }

  shortToastError(message:string, title:string){
    return this.toastrService.error(message, title,{
      timeOut: 4000
    })
  }
}
