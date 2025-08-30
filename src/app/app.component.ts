import { Component, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
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
export class AppComponent implements OnInit {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly mouseEventEmitService: MouseEventEmitService = inject(MouseEventEmitService);
  private readonly mainContainerScrollService: MainContainerScrollService = inject(MainContainerScrollService)
  private readonly breakpointDetectionService: BreakpointDetectionService = inject(BreakpointDetectionService);

  @ViewChild('drawer') drawer?: MatSidenav;
  @ViewChild('drawerContent') drawercontent?: MatDrawerContent;
  isBrowser: boolean = isPlatformBrowser(this.platformId);
  breakpointDetection$: Observable<boolean> = this.breakpointDetectionService.detection$();

  ratingValue = 3.6;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.setScroll();
  }

  toggle() {
    this.drawer?.toggle();
  }

  onActivate() {
    if (this.isBrowser) {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  mouseEventEmit(event: MouseEvent) {
    if (event.type === 'mouseenter') {
      this.mouseEventEmitService.set(true);
    } else if (event.type === 'mouseleave') {
      this.mouseEventEmitService.set(false);
    }
  }

  onScroll(event: Event): void {
    const target: HTMLDivElement = event.target as HTMLDivElement;
    const index = target.scrollTop;
    const indexBottom = target.scrollHeight - target.clientHeight;

    this.mainContainerScrollService.setPositionTop(index);
    this.mainContainerScrollService.setPositionBottom(indexBottom - index);
  };

  setScroll() {
    this.subscription.add(
      this.mainContainerScrollService.listenDirectionPostion$.subscribe(res => {
        if (res) {
          if (res.direction === 'x') {
            this.drawercontent?.scrollTo({ left: res.position, behavior: "smooth" });
          } else if (res.direction === 'y') {
            this.drawercontent?.scrollTo({ top: res.position, behavior: "smooth" })
          }
        }
      })
    )
  }
}
