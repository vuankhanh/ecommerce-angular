import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../module/material';
import { DeliveryEntity } from '../../../entity/deliverty.entity';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';
import { NgxMaskDirective } from 'ngx-mask';
import { IAddress } from '../../../models/address.interface';
import { BehaviorSubject, lastValueFrom, map, Observable, take } from 'rxjs';
import { vietnamesePhoneNumberValidator } from '../../validator/vietnamese-phone-number.validator';

@Component({
  selector: 'app-delivery',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    AddressSelectorComponent,

    NgxMaskDirective,

    MaterialModule
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DeliveryComponent>);
  readonly data = inject<DeliveryEntity | null>(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly bControlFormChanged: BehaviorSubject<Record<string, any>> = new BehaviorSubject<Record<string, any>>({});
  private readonly controlFormChanged$: Observable<Record<string, any>> = this.bControlFormChanged.asObservable();
  isFormChanged$: Observable<boolean> = this.controlFormChanged$.pipe(
    map((value: Record<string, any>) => {
      return Object.keys(value).length > 0;
    }),
  );

  addressValid = false;

  formGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    phoneNumber: ['', [Validators.required, vietnamesePhoneNumberValidator()]],
    address: [{
      province: '',
      district: '',
      ward: '',
      street: ''
    }]
  });

  get addressControl() {
    return this.formGroup.get('address') as FormGroup;
  }

  ngOnInit(): void {
    if (this.data) {
      this.formGroup.patchValue({
        ...this.data
      });

      this.cdr.detectChanges();

      this.formGroup.valueChanges.subscribe((value) => {
        //Lấy ra các control đã thay đổi
        const changedControls: Record<string, any> = {};
        Object.keys(value).forEach(key => {
          if (!this.data) return;
          const jsonValue = JSON.stringify(value[key]);
          const jsonData = JSON.stringify(this.data[key as keyof DeliveryEntity]);
          if (jsonValue !== jsonData) {
            if(value[key] === '') return;
            changedControls[key] = value[key];
          }
        });

        this.bControlFormChanged.next(changedControls);
      })
    }
  }

  addressSelectionChange(address: IAddress) {
    this.addressControl.patchValue(address)
  }

  addressValidChange(valid: boolean): void {
    this.addressValid = valid;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      if(this.data) {
        const partialDelivery = await lastValueFrom(this.controlFormChanged$.pipe(take(1)));
        this.dialogRef.close(partialDelivery)
      }else {
        const delivery: DeliveryEntity = new DeliveryEntity(this.formGroup.value);
        this.dialogRef.close(delivery.toPlainObject());
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
