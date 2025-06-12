import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { ConvertVieService } from '../services/convert-vie.service';
import { DirectionPostion, MainContainerScrollService } from '../services/main-container-scroll.service';

const headerOffset = 85;
@Directive({
  selector: '[appGenerateTableContents]'
})
export class GenerateTableContentsDirective implements AfterViewInit {
  private headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  constructor(
    private el: ElementRef,
    private convertVieService: ConvertVieService,
    private mainContainerScrollService: MainContainerScrollService
  ) {}

  ngAfterViewInit(): void {
    let postsContainer: HTMLDivElement = this.el.nativeElement;
    this.getAllElement(postsContainer);
  }

  private getAllElement(postsContainer: HTMLDivElement){
    let tableContents: Array<TableContent> = [];
    let elements = postsContainer.children;
    for(let i=0; i<=elements.length-1; i++){
      let childElement = elements[i];
      let nodeNameElement = childElement.nodeName;
      if(this.headings.includes(nodeNameElement.toLowerCase())){

        if(childElement.textContent){
          let id = this.convertVieService.removeVietnameseTones(childElement.textContent);
          let getNumberOfLevel = nodeNameElement.replace( /^\D+/g, '');
          let level = parseInt(getNumberOfLevel) | 0;
  
          //Set Id for Heading Element
          childElement.id = id;
          let tableContent: TableContent = {
            id,
            level,
            heading: childElement.textContent || ''
          }
  
          tableContents.push(tableContent);
        }
      }else{
        if(nodeNameElement==='P'){
          let elements = childElement.children;
          for(let i=0; i<=elements.length-1; i++){
            let element = elements[i];
            let nodeNameElement = element.nodeName;
            if(nodeNameElement === 'IMG'){
              let imgElemet: HTMLImageElement = element as HTMLImageElement;
              imgElemet.loading = 'lazy';
            }
          }
        }
      }
    }

    //Generate Table Contens
    if(tableContents.length){
      let tableContentContainer = this.generateTableContents(tableContents);

      //Insert Table Contens as a first child element of Posts Container
      postsContainer.prepend(tableContentContainer);
    }
  }

  private generateTableContents(tableContents: Array<TableContent>){
    let tableContentsContainer: HTMLDivElement = <HTMLDivElement>document.createElement("DIV");
    tableContentsContainer.style.borderRadius = '5px';
    tableContentsContainer.style.border = '1px dotted var(--normal-text)';
    
    tableContentsContainer.style.marginBottom = '10px';

    let title: HTMLDivElement = <HTMLDivElement>document.createElement("DIV");
    title.innerHTML = '<i class="fa fa-list-ol"></i>' +
                      '<div class="micro-width-space"></div>' +
                      '<span>Mục lục nội dung</span>';
    title.className = 'horizontal-container';
    title.style.alignItems = 'center';
    title.style.fontSize = '16px';
    title.style.fontWeight = '450';
    title.style.lineHeight = '1';
    title.style.padding = '10px';
    title.style.boxSizing = 'border-box';
    
    tableContentsContainer.appendChild(title);

    let ul: HTMLUListElement = <HTMLUListElement>document.createElement("ul");

    //Loop Array Table Contents And Create Element Anchor
    for(let i=0; i<=tableContents.length-1; i++){
      let item = tableContents[i];
      let anchorElement = document.createElement('a');
      anchorElement.href = '#'+item.id;
      anchorElement.innerText = item.heading;

      anchorElement.style.textDecoration = 'none';
      anchorElement.style.cursor = 'pointer';

      //Add event when click to item of table contents
      anchorElement.addEventListener("click", (e)=>{
        e.preventDefault();
        //Get Heading Element Follow Id
        let element = document.getElementById(item.id);
        let directionPostion: DirectionPostion = {
          direction: 'y',
          position: element!.offsetTop - headerOffset
        }
        this.mainContainerScrollService.setDirectionPosition(directionPostion);
        if(element){
          element.style.outline = '1px solid';
          setTimeout(() => {
            if(element){
              element.style.outline = 'none';
            }
          }, 1000);
        }
      })

      //Add event Mouse Over
      anchorElement.addEventListener("mouseover", function() {
        anchorElement.style.textDecoration = 'underline';
      });

      //Add event Mouse Out
      anchorElement.addEventListener("mouseout", function() {
        anchorElement.style.textDecoration = 'none';
      });

      let li: HTMLLIElement = <HTMLLIElement>document.createElement("li");
      li.appendChild(anchorElement);
      li.style.marginLeft = item.level*15+'px';

      ul.appendChild(li);
    }
    ul.style.margin = '10px 0';

    tableContentsContainer.appendChild(ul);
    return tableContentsContainer;
  }
}

interface TableContent{
  id: string,
  level: number,
  heading: string
}
