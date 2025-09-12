import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from './sharing/module/material';
import { DrawerComponent } from './drawer/drawer.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MouseEventEmitService } from './services/mouse-event-emit.service';
import { MainContainerScrollService } from './services/main-container-scroll.service';
import { BreakpointDetectionService } from './services/breakpoint-detection.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterOutlet,
        DrawerComponent,
        HeaderComponent,
        FooterComponent,
        MaterialModule
      ],
      providers: [
        { provide: MouseEventEmitService, useValue: { set: jasmine.createSpy('set') } },
        { provide: MainContainerScrollService, useValue: { 
          setPositionTop: jasmine.createSpy('setPositionTop'),
          setPositionBottom: jasmine.createSpy('setPositionBottom'),
          listenDirectionPostion$: of(null)
        }},
        { provide: BreakpointDetectionService, useValue: { detection$: () => of(true) } }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should toggle drawer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.drawer = { toggle: jasmine.createSpy('toggle') } as any;
    app.toggle();
    expect(app?.drawer?.toggle).toHaveBeenCalled();
  });

  it('should emit mouse enter event', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const event = new MouseEvent('mouseenter');
    spyOn(app['mouseEventEmitService'], 'set');
    app.mouseEventEmit(event);
    expect(app['mouseEventEmitService'].set).toHaveBeenCalledWith(true);
  });

  it('should emit mouse leave event', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const event = new MouseEvent('mouseleave');
    spyOn(app['mouseEventEmitService'], 'set');
    app.mouseEventEmit(event);
    expect(app['mouseEventEmitService'].set).toHaveBeenCalledWith(false);
  });
});