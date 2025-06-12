import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { toHTML } from "ngx-editor";

import { SupportDetail } from 'src/app/models/Support';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  supportDetail: SupportDetail;
  preview: any;

  subscription: Subscription = new Subscription();
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const activatedRouteData$ = this.activatedRoute.data.pipe(
      map(data => <SupportDetail>data.support)
    );

    activatedRouteData$.subscribe(res=>{
      if(res){
        this.supportDetail = res;
        this.preview =  toHTML(JSON.parse(this.supportDetail.postsId.data));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
