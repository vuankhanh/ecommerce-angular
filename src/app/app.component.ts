import { AfterViewInit, Component, inject, Inject, isDevMode, OnInit, PLATFORM_ID, Renderer2, ViewChild, DOCUMENT } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './sharing/module/material';
import { DrawerComponent } from './drawer/drawer.component';
import { MatDrawerContent, MatSidenav } from '@angular/material/sidenav';
import { MouseEventEmitService } from './services/mouse-event-emit.service';
import { MainContainerScrollService } from './services/main-container-scroll.service';
import { AppServicesService } from './services/app-services.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BreadCrumbComponent } from './main/bread-crumb/bread-crumb.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,

    DrawerComponent,
    HeaderComponent,
    BreadCrumbComponent,
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
  screenWidthSize: 'full' | 'normal' | 'mini' = 'normal';

  ratingValue: number = 3.6;
  
  private readonly subscription: Subscription = new Subscription();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private renderer2: Renderer2,
    private mouseEventEmitService: MouseEventEmitService,
    private mainContainerScrollService: MainContainerScrollService,
    private appService: AppServicesService
  ){
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(){
    this.listenIsMobile();
    this.setScroll();

    if(this.isBrowser){
      if(!isDevMode()){
        this.setMetaTagForFacebook();
      }
    }


    
  }

  ngAfterViewInit(): void {

  }

  setMetaTagForFacebook(){
    let scriptPixel = this.renderer2.createElement('script');
    scriptPixel.type = `text/javascript`;
    scriptPixel.text = `!function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '219934090324074');
    fbq('track', 'PageView');`;

    let scriptNoScript = this.renderer2.createElement('noscript');
    scriptNoScript.inner = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=219934090324074&ev=PageView&noscript=1"
    />`;

    // let scriptMessage = this.renderer2.createElement('script');
    // scriptMessage.type = `text/javascript`;
    // scriptMessage.text = `
    //   window.fbAsyncInit = function() {
    //     FB.init({
    //       appId            : '583183603050614',
    //       autoLogAppEvents : true,
    //       xfbml            : true,
    //       version          : 'v12.0'
    //     });
    //   };
    
    //   (function(d, s, id){
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) {return;}
    //     js = d.createElement(s); js.id = id;
    //     js.src = "https://connect.facebook.net/vi_VN/sdk.js";
    //     fjs.parentNode.insertBefore(js, fjs);
    //   }(document, 'script', 'facebook-jssdk'));
    // `;

    // let fbCustomerChat = this.renderer2.createElement('div');
    // fbCustomerChat.setAttribute('class', 'fb-customerchat');
    // fbCustomerChat.setAttribute('page_id', '104868241888740');
    
    this.renderer2.appendChild(this._document.head, scriptPixel);
    this.renderer2.appendChild(this._document.head, scriptNoScript);
    // this.renderer2.appendChild(this._document.body, scriptMessage);
    // this.renderer2.appendChild(this._document.body, fbCustomerChat);
  }

  listenIsMobile(){
    this.subscription.add(
      this.appService.checkScreenWidthSize$.subscribe(res=>{
        this.screenWidthSize = res;
      })
    )
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
    this.mainContainerScrollService.setPositionTop(index);
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
