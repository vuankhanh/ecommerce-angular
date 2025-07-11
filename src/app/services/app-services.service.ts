import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Product } from '../models/Product';
import { ProductCategory } from '../models/ProductCategory';

import { ProductService } from './api/product/product.service';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
// import { SocketIoService } from './socket/socket-io.service';
import { DirectionPostion, MainContainerScrollService } from './main-container-scroll.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { TToken } from '../models/token.interface';
import { LocalStorageKey } from '../sharing/constant/local_storage.constant';

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
