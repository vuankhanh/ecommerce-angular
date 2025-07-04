import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../pipes/prefix-backend.pipe';
import { TProductCategoryModel } from '../../models/product-category.interface';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,

    RouterOutlet,
    RouterLink,
    RouterLinkActive,

    PrefixBackendStaticPipe
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  productCategorise$: Observable<TProductCategoryModel[]> = this.activatedRoute?.data.pipe(
    map(data => data['productCategories'] as TProductCategoryModel[]),
  )

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    const slug$ = this.productCategorise$.pipe(
      filter(productCategories => !!productCategories.length),
      map(productCategories => productCategories[0].slug)
    );

    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => this.activatedRoute.children),
        filter(children => !children.length),
        switchMap(_ => slug$)
      ).subscribe((slug) => {
        this.router.navigate(['san-pham', slug]);
      })
    );

    this.subscription.add(
      slug$.pipe(
        take(1),
        filter(_=>!this.activatedRoute.children.length )
      ).subscribe((slug) => {
        this.router.navigate(['san-pham', slug]);
      })
    )
  }

  dosomething(event: any) {
    let img: HTMLImageElement = <HTMLImageElement>event.target;
    if (img) {
      let src: string = img.src;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
