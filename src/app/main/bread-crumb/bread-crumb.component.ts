import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { IBreadcrumb } from '../../models/breadcrumb.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bread-crumb',
  standalone: true,
  imports: [
    CommonModule,

    RouterLink
  ],
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {
  private breadcrumbService: BreadcrumbService = inject(BreadcrumbService);
  breadcrumbs$?: Observable<IBreadcrumb[]>;

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
