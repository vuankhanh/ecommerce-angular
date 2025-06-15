import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Product } from '../models/Product';
import { ProductCategory } from '../models/ProductCategory';

import { ProductService } from './api/product/product.service';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { AddIconSvgService } from './add-icon-svg.service';
// import { SocketIoService } from './socket/socket-io.service';
import { DirectionPostion, MainContainerScrollService } from './main-container-scroll.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { TToken } from '../models/token.interface';

const defaultPageTitle = 'Thủy Hải Sản Carota';
@Injectable({
  providedIn: 'root'
})
export class AppServicesService {
  // public checkScreenWidthSize$: Observable<'Medium' | 'Small' | 'XSmall'>;
  public checkScreenWidthSize$: Observable<'full' | 'normal' | 'mini'>;

  private bProductCategory: BehaviorSubject<ProductCategory[]> = new BehaviorSubject<ProductCategory[]>([]);
  public productCategory$: Observable<ProductCategory[]> = this.bProductCategory.asObservable();

  private bProductHightlight: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public productHightlight$: Observable<Product[]> = this.bProductHightlight.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private addIconSvgService: AddIconSvgService,
    // private socketIoService: SocketIoService,
    private mainContainerScrollService: MainContainerScrollService
  ) {

    // [Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall]
    this.checkScreenWidthSize$ = this.breakpointObserver.observe(
      [
        '(min-width: 768px) and (max-width: 1023.98px)',
        '(max-width: 767.98px)'
      ]
    ).pipe(map((state: BreakpointState)=>{
      if(state.breakpoints['(min-width: 768px) and (max-width: 1023.98px)']){
        return 'normal';
      }else if(state.breakpoints['(max-width: 767.98px)']){
        return 'mini';
      }else{
        return 'full';
      }
    }));

    this.productService.getCategory().pipe(
      take(1)
    ).subscribe({
      next: (res) => this.bProductCategory.next(res),
      error: (err) => console.log('Có lỗi xảy ra khi lấy danh sách danh mục sản phẩm: ', err.message),
      complete: () => console.log('Đã lấy xong danh sách danh mục sản phẩm')
    });

    this.productService.getProductHightlight().pipe(
      take(1)
    ).subscribe({
      next: (res) => this.bProductHightlight.next(res),
      error: (err) => console.log('Có lỗi xảy ra khi lấy danh sách sản phẩm nổi bật: ', err.message),
      complete: () => console.log('Đã lấy xong danh sách sản phẩm nổi bật')
    });

    this.addIconSvgService.addIcon();

    let tokenStoraged: TToken = <TToken>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
    if(tokenStoraged && tokenStoraged.accessToken){
      let accessToken = tokenStoraged.accessToken;
      this.authService.checkTokenValidation(accessToken);
    }

    //Set Title For Page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
  
        if (!child) {
          return this.activatedRoute.snapshot.data['title'] || defaultPageTitle;
        }
  
        while (child.firstChild) {
          child = child.firstChild;
        }
  
        if (child.snapshot.data['title']) {
          return child.snapshot.data['title'] || defaultPageTitle;
        }
      })
    ).subscribe((title: string) => {
      let directionPostion: DirectionPostion = {
        direction: 'y',
        position: 0
      }
      this.mainContainerScrollService.setDirectionPosition(directionPostion);
      if(title){
        this.title.setTitle(title);
      }
    });
  }
}
