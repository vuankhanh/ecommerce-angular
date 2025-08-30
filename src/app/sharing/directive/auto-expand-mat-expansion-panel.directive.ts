import { Directive, inject, Input, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { TMenu } from '../../models/menu.interface';

@Directive({
  selector: '[appAutoExpand]',
  standalone: true
})
export class AutoExpandMatExpansionPanelDirective implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly expansionPanel: MatExpansionPanel = inject(MatExpansionPanel);
  @Input() appAutoExpand: TMenu[] | undefined = [];

  ngOnInit() {
    const hasActiveChild = this.appAutoExpand?.some(child => 
      this.router.url.includes(child!.route!)
    );
    
    if (hasActiveChild) {
      this.expansionPanel.open();
    }
  }
}