import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  breadcrumbs$?: Observable<IBreadcrumb[]>;
  constructor(
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
