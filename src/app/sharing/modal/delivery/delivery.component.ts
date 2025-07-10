import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/input';
import { MaterialModule } from '../../module/material';
import { DeliveryEntity } from '../../../entity/deliverty.entity';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';
import { Validators } from 'ngx-editor';
import { NgxMaskDirective } from 'ngx-mask';
import { IAddress } from '../../../models/address.interface';

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

  addressValid: boolean = false;

  formGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    phoneNumber: ['', Validators.required],
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
    }
  }

  addressSelectionChange(address: IAddress) {
    console.log(address);
    
    this.addressControl.patchValue(address)
  }

  addressValidChange(valid: boolean): void {
    this.addressValid = valid;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('Form submitted:', this.formGroup.value);
      
      const delivery: DeliveryEntity = new DeliveryEntity(this.formGroup.value);
      this.dialogRef.close(delivery);
    } else {
      console.error('Form is invalid');
    }
  }
}
