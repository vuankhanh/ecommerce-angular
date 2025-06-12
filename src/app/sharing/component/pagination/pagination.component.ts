import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { PaginationConfiguration } from '../../../models/PaginationConfiguration';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() config?: PaginationConfiguration;
  @Output() emitChangeIndex = new EventEmitter<number>();
  listButton: Array<number> = [];
  constructor() { }

  ngOnInit() {
    if(this.config){
      for(let i=1; i<=this.config.totalPages; i++){
        this.listButton.push(i);
      }
    }
  }

  changeIndex(index: number){
    this.emitChangeIndex.emit(index);
  }

}
