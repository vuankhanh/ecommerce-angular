import { AfterViewInit, Component, inject, Inject, isDevMode, OnInit, PLATFORM_ID, Renderer2, ViewChild, DOCUMENT } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './sharing/module/material';
import { DrawerComponent } from './drawer/drawer.component';
import { MatDrawerContent, MatSidenav } from '@angular/material/sidenav';
import { MouseEventEmitService } from './services/mouse-event-emit.service';
import { MainContainerScrollService } from './services/main-container-scroll.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Observable, Subscription } from 'rxjs';
import { BreakpointDetectionService } from './services/breakpoint-detection.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,

    DrawerComponent,
    HeaderComponent,
    FooterComponent,

    MaterialModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer?: MatSidenav;
  @ViewChild ('drawerContent') drawercontent?: MatDrawerContent;
  isBrowser: boolean;
  breakpointDetection$: Observable<boolean> = this.breakpointDetectionService.detection$();

  ratingValue: number = 3.6;
  
  private readonly subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private renderer2: Renderer2,
    private mouseEventEmitService: MouseEventEmitService,
    private mainContainerScrollService: MainContainerScrollService,
    private breakpointDetectionService: BreakpointDetectionService
  ){
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(){
    this.setScroll();
  }

  ngAfterViewInit(): void {

  }

  toggle(event: any){
    this.drawer?.toggle();
  }

  onActivate() {
    if(this.isBrowser){
      window.scroll({
        top: 0,
        behavior: 'smooth' 
      });
    }
  }

  mouseEventEmit(event: MouseEvent){
    if(event.type === 'mouseenter'){
      this.mouseEventEmitService.set(true);
    }else if(event.type === 'mouseleave'){
      this.mouseEventEmitService.set(false);
    }
  }

  onScroll = (event: any): void => {
    let target: HTMLDivElement = <HTMLDivElement>event.target;
    let index: number = target.scrollTop;
    let indexBottom = target.scrollHeight - target.clientHeight;
    
    this.mainContainerScrollService.setPositionTop(index);
    this.mainContainerScrollService.setPositionBottom(indexBottom - index);
  };

  setScroll(){
    this.subscription.add(
      this.mainContainerScrollService.listenDirectionPostion$.subscribe(res=>{
        if(res){
          if(res.direction === 'x'){
            this.drawercontent?.scrollTo({ left: res.position, behavior: "smooth" });
          }else if(res.direction === 'y'){
            this.drawercontent?.scrollTo({ top: res.position, behavior: "smooth" })
          }
        }
      })
    )
  }
}
