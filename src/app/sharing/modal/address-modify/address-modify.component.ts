import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { ResponseLogin } from 'src/app/services/api/login.service';
import { AdministrativeUnitsService } from 'src/app/services/api/administrative-units.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

import { Subscription } from 'rxjs';
import { UserInformation } from 'src/app/models/UserInformation';
import { Address, Province, District, Ward, Position } from 'src/app/models/Address';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerAddressService, ResponseAddress } from 'src/app/services/api/customer-address.service';

@Component({
  selector: 'app-address-modify',
  templateUrl: './address-modify.component.html',
  styleUrls: ['./address-modify.component.scss']
})
export class AddressModifyComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;

  provinces: Array<Province> = [];
  districts: Array<District> = [];
  wards: Array<Ward> = [];

  subscription: Subscription = new Subscription();
  constructor(
    public dialogRef: MatDialogRef<AddressModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataInit,
    private formBuilder: FormBuilder,
    private administrativeUnitsService: AdministrativeUnitsService,
    private localStorageService: LocalStorageService,
    private customerAddressService: CustomerAddressService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.getProvince();
    this.checkModalType(this.data);
  }

  formInit(){
    let phoneNumberRegEx = /((0)+([0-9]{9})\b)/g;
    this.addressForm = this.formBuilder.group({
      responsiblePerson: ['', Validators.required],
      phoneNumber: ['', { validators: [Validators.required, , Validators.pattern(phoneNumberRegEx)], updateOn: 'blur' }],
      street: ['', Validators.required],
      ward: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      position: this.formBuilder.group({
        lat: [''],
        lng: ['']
      }),
      isHeadquarters: [false, Validators.required],
    })
  }

  checkModalType(dataInit: DataInit){
    if(dataInit.type === 'insert'){
      
    }else if(dataInit.type === 'update' && dataInit.address){
      this.addressForm.controls['responsiblePerson'].setValue(dataInit.address.responsiblePerson);
      this.addressForm.controls['phoneNumber'].setValue(dataInit.address.phoneNumber);
      this.addressForm.controls['street'].setValue(dataInit.address.street);
      this.addressForm.controls['isHeadquarters'].setValue(dataInit.address.isHeadquarters);
      this.addressForm.get('position')?.get('lat')?.setValue(dataInit.address.position?.lat);
      this.addressForm.get('position')?.get('lng')?.setValue(dataInit.address.position?.lng);
      this.getDistrict(dataInit.address.province.code);
      this.getWard(dataInit.address.district.code);
    }
  }

  getProvince(){
    this.subscription.add(
      this.administrativeUnitsService.getProvince().subscribe(res=>{
        this.provinces = res;
        if(this.data.type === 'update' && this.data.address){
          let index:number = this.findIndexOfObjectInArray(this.data.address.province._id, this.provinces);
          
          this.addressForm.controls['province'].setValue(index);
        }
      })
    )
  }

  getDistrict(provinceCode: string){
    this.subscription.add(
      this.administrativeUnitsService.getDistrict(provinceCode).subscribe(res=>{
        this.districts = res;
        if(this.data.type === 'update' && this.data.address){
          let index:number = this.findIndexOfObjectInArray(this.data.address.district._id, this.districts)
          this.addressForm.controls['district'].setValue(index);
        }
      }, error=>{
        this.districts = [];
      })
    )
  }

  getWard(districtCode: string){
    this.subscription.add(
      this.administrativeUnitsService.getWard(districtCode).subscribe(res=>{
        this.wards = res;
        if(this.data.type === 'update' && this.data.address){
          let index:number = this.findIndexOfObjectInArray(this.data.address.ward._id, this.wards)
          this.addressForm.controls['ward'].setValue(index);
        }
      })
    )
  }

  provinceChange(event: MatSelectChange){
    let index: number = event.value;
    let province: Province = this.provinces[index];
    this.getDistrict(province.code);
  }

  districtChange(event: MatSelectChange){
    let index: number = event.value;
    let district: District = this.districts[index];
    this.getWard(district.code);
  }

  submit(){
    if(this.data.type === 'insert'){
      this.insert();
    }else if(this.data.type === 'update'){
      this.update();
    }else{
      this.toastService.shortToastError('Đã có lỗi xảy ra', 'Lỗi ')
    }
  }

  update(){
    if(this.addressForm.valid){
      let address: Address = {
        _id: this.data.address?._id,
        responsiblePerson: this.addressForm.value.responsiblePerson,
        phoneNumber: this.addressForm.value.phoneNumber,
        street: this.addressForm.value.street,
        province: this.provinces[this.addressForm.value.province],
        district: this.districts[this.addressForm.value.district],
        ward: this.wards[this.addressForm.value.ward],
        position: this.addressForm.value.position,
        isHeadquarters: this.addressForm.value.isHeadquarters,
      }
      
      let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
      if(tokenStoraged){
        this.subscription.add(
          this.customerAddressService.update(tokenStoraged.accessToken, address).subscribe(res=>{
            this.toastService.shortToastSuccess('Đã cập nhật địa chỉ thành công', 'Thành công');
            this.dialogRef.close(res);
          },error=>{
            this.toastService.shortToastError('Đã có lỗi xảy ra', 'Thất bại');
          })
        )
      }
      
    }
  }

  async insert(){
    if(this.addressForm.valid){
      let address: Address = {
        street: this.addressForm.value.street,
        responsiblePerson: this.addressForm.value.responsiblePerson,
        phoneNumber: this.addressForm.value.phoneNumber,
        province: this.provinces[this.addressForm.value.province],
        district: this.districts[this.addressForm.value.district],
        ward: this.wards[this.addressForm.value.ward],
        position: this.addressForm.value.position,
        isHeadquarters: this.addressForm.value.isHeadquarters,
      };
      
      let tokenStoraged: ResponseLogin = <ResponseLogin>this.localStorageService.get(this.localStorageService.tokenStoragedKey);
      if(tokenStoraged){
        this.subscription.add(
          this.customerAddressService.insert(tokenStoraged.accessToken, address).subscribe(res=>{
            this.toastService.shortToastSuccess('Đã thêm địa chỉ thành công', 'Thành công');
            this.dialogRef.close(res);
          },error=>{
            this.toastService.shortToastError('Đã có lỗi xảy ra', 'Thất bại');
          })
        )
      }
      
    }
  }

  findIndexOfObjectInArray(
    id: string,
    array: Array<Province> | Array<District> | Array<Ward>
  ){
    return array.findIndex(object=>object._id === id);
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

interface DataInit{
  type: string,
  address: Address | null
}
