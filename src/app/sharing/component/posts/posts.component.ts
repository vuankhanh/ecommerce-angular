import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { toHTML } from "ngx-editor";
import { Posts } from '../../../models/Posts';
import { SanitizeHtmlBindingPipe } from '../../pipe/sanitize-html-binding.pipe';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    SanitizeHtmlBindingPipe
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnChanges {
  @Input() editorContent?: Posts;
  preview: string = '';
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const editorContentChange = simpleChanges['editorContent'];
    if (editorContentChange && editorContentChange.currentValue !== editorContentChange.previousValue) {
      this.preview =  toHTML(JSON.parse(editorContentChange.currentValue));
    }
  } 
}
