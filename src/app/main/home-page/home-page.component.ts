import { AfterViewInit, Component, OnInit } from '@angular/core';

import { ProductCategory } from 'src/app/models/ProductCategory';

import { AppServicesService } from 'src/app/services/app-services.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  category$: Observable<ProductCategory[]>;
  constructor(
    private appServiceService: AppServicesService
  ) {
    this.category$ = this.appServiceService.productCategory$;
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(){

  }
}
