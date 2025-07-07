import { Component, Input, OnInit, } from '@angular/core';
import { ConfigService } from '../../../services/api/config.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

const totalNumberOfStars = 5;
@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() ratingValue: number = 0;
  @Input() showRatingTitle?: boolean;
  
  ratingValueFloor: number = 0;
  totalNumberOfStars = Array(totalNumberOfStars).fill(null).map((value, index)=>index+1);
  ratingTitle?: string;
  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.ratingValueFloor = Math.floor(this.ratingValue);
    if(this.showRatingTitle){
      this.listenConfig();
    }
  }

  listenConfig(){
    this.configService.getConfig().subscribe((res:any)=>{
      let ratings = res.rating;
      ratings.forEach((rating:any)=>{
        if(rating.value === this.ratingValueFloor){
          this.ratingTitle = rating.title;
        }
      })
    })
  }

}
