import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Rating } from 'src/app/models/ServerConfig';

import { ConfigService } from 'src/app/services/api/config.service';
import { ProductReviewsService, ReviewsWillUpload } from 'src/app/services/api/product/product-reviews.service';
import { ToastService } from 'src/app/services/toast.service';

import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/Product';

const totalNumberOfStars = 5;
@Component({
  selector: 'app-write-rating',
  templateUrl: './write-rating.component.html',
  styleUrls: ['./write-rating.component.scss']
})
export class WriteRatingComponent implements OnInit {
  totalNumberOfStars = Array(totalNumberOfStars).fill(null).map((value, index)=>index+1);

  ratingForm: FormGroup;

  mouseIndex: number = -1;
  rateSelection: number = this.mouseIndex;
  ratingTitle: string;

  ratings: Array<Rating>;

  subscription: Subscription = new Subscription();
  constructor(
    public dialogRef: MatDialogRef<WriteRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private productReviewsService: ProductReviewsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.listenConfig();
    this.initForm();
  }

  listenConfig(){
    this.subscription.add(
      this.configService.getConfig().subscribe(res=>{
        this.ratings = res.rating;
        this.setRatingTitle(this.ratings);
      })
    )
  }

  initForm(){
    let phoneNumberRegEx = /((0)+([0-9]{9})\b)/g;
    this.ratingForm = this.formBuilder.group({
      clientInformation: this.formBuilder.group({
        name: ['', Validators.required],
        phoneNumber: ['', { validators: [Validators.required, Validators.pattern(phoneNumberRegEx)], updateOn: 'blur' }],
      }),
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      content: ['', Validators.required]
    });
  }

  mouseenter(event: MouseEvent, index: number){
    if(this.mouseIndex <= index){
      this.rateSelection=index;
    }
  }

  mouseleave(event: MouseEvent){
    this.rateSelection = this.mouseIndex;
  }

  setRateSelection(index: number){
    this.mouseIndex = index;
    this.rateSelection = this.mouseIndex;
    this.setRatingTitle(this.ratings);
    this.ratingForm.controls['rating'].setValue(this.mouseIndex);
  }

  setRatingTitle(ratings: Array<Rating>){
    ratings.forEach(rating=>{
      if(rating.value === this.rateSelection){
        this.ratingTitle = rating.title;
      }
    })
  }

  sendReviews(){
    if(this.ratingForm.valid){
      let reviewsWillUpload: ReviewsWillUpload = {
        productId: this.product._id,
        ...this.ratingForm.value
      }
      this.subscription.add(
        this.productReviewsService.insert(reviewsWillUpload).subscribe(res=>{
          this.dialogRef.close(res);
        },error=>{
          this.toastService.shortToastError('', 'Đã có lỗi xảy ra');
        })
      )
    }
  }

}
