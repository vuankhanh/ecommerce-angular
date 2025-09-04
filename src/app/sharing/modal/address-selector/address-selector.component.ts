import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../module/material';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, scan, startWith, Subscription, switchMap, tap } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { isEqual } from 'lodash';
import { TAddressMetaData, TinhthanhphoComApiService } from '../../../services/api/tinhthanhpho-com-api.service';
import { IAddress } from '../../../models/address.interface';
import { IDistrict, IProvince, IWard } from '../../../models/tinhthanhpho_com_api.interface';
import { MatAutocompleteScrollEndDirective } from '../../directive/mat-autocomplete-scroll-end.directive';
import { PaginationConstant } from '../../constant/pagination.constant';
import { IPagination } from '../../../models/pagination.interface';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [
    CommonModule,

    MatAutocompleteScrollEndDirective,

    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './address-selector.component.html',
  styleUrl: './address-selector.component.scss'
})
export class AddressSelectorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() address!: IAddress;
  @Output() addressValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() valueChange: EventEmitter<IAddress> = new EventEmitter<IAddress>();
  @ViewChild('provinceEl') provinceEl!: ElementRef<MatInput>;
  @ViewChild('districtEl') districtEl!: ElementRef<MatInput>;
  @ViewChild('wardEl') wardEl!: ElementRef<MatInput>;
  @ViewChild('streetEl') streetEl!: ElementRef<MatInput>;

  private readonly renderer = inject(Renderer2)
  private readonly fb = inject(FormBuilder);
  private readonly tinhthanhphoComApiService = inject(TinhthanhphoComApiService);
  addressForm: FormGroup;
  provincesData$: Observable<IProvince[]> = of([]);
  private readonly bProvincesPagination: BehaviorSubject<IPagination> = new BehaviorSubject(PaginationConstant);
  isEnableLoadingMoreProvinces = true;
  isShowLoadingMoreProvinces = false;
  districtsData$: Observable<IDistrict[]> = of([]);
  private readonly bDistrictsPagination: BehaviorSubject<IPagination> = new BehaviorSubject(PaginationConstant);
  isEnableLoadingMoreDistricts = true;
  isShowLoadingMoreDistricts = false;
  wardsData$: Observable<IWard[]> = of([]);
  private readonly bWardsPagination: BehaviorSubject<IPagination> = new BehaviorSubject(PaginationConstant);
  isEnableLoadingMoreWards = true;
  isShowLoadingMoreWards = false;

  bProvinceInputChange = new BehaviorSubject<string>('');
  bDistrictInputChange = new BehaviorSubject<string>('');
  bWardInputChange = new BehaviorSubject<string>('');

  private readonly subscription: Subscription = new Subscription();
  constructor() {
    this.addressForm = this.fb.group({
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      street: ['', Validators.required],
    });

    this.subscription.add(
      this.addressForm.valueChanges.pipe(
        distinctUntilChanged((prev, curr) => {
          return isEqual(prev, curr)
        })
      ).subscribe(value => {
        this.addressValidChange.emit(this.addressForm.valid);
        this.valueChange.emit(value);
      })
    )
  }

  get provinceControl() {
    return this.addressForm.get('province')!;
  }

  get districtControl() {
    return this.addressForm.get('district')!;
  }

  get wardControl() {
    return this.addressForm.get('ward')!;
  }

  get streetControl() {
    return this.addressForm.get('street')!;
  }

  ngOnInit(): void {
    this.setProvince$();

    this.provinceControl.setValue(this.address?.province);
    this.districtControl.setValue(this.address?.district);
    this.wardControl.setValue(this.address?.ward);
    this.streetControl.setValue(this.address?.street);
  }

  onProvinceOptionSelected(event: MatAutocompleteSelectedEvent) {
    const plainProvnce = { ...event.option.value };

    const province: IProvince = plainProvnce;
    this.provinceEl.nativeElement.value = province.name;
    this.districtEl.nativeElement.value = null;
    this.wardEl.nativeElement.value = null;

    this.bDistrictsPagination.next(PaginationConstant);
    this.bWardsPagination.next(PaginationConstant);

    this.provinceControl.setValue(province);
    this.setDistrict$(province.code);
    this.districtControl.setValue(null);
    this.wardControl.setValue(null);
  }

  onProvincesScrollBottom() {
    this.isShowLoadingMoreProvinces = true;
    const { size, page, totalItems, totalPages } = this.bProvincesPagination.getValue();
    if (page < totalPages) {
      this.bProvincesPagination.next({
        size,
        page: page + 1,
        totalItems,
        totalPages
      });
    }else {
      this.isEnableLoadingMoreProvinces = false;
    }
  }

  onDistrictOptionSelected(event: MatAutocompleteSelectedEvent) {
    const district: IProvince = event.option.value;
    this.districtEl.nativeElement.value = district.name;
    this.wardEl.nativeElement.value = null;

    this.bWardsPagination.next(PaginationConstant);

    this.districtControl.setValue(district);
    this.setWard$(district.code);
    this.wardControl.setValue(null);
  }

  onDistrictsScrollBottom() {
    this.isShowLoadingMoreDistricts = true;
    const { size, page, totalItems, totalPages } = this.bDistrictsPagination.getValue();
    if (page < totalPages) {
      this.bDistrictsPagination.next({
        size,
        page: page + 1,
        totalItems,
        totalPages
      });
    }else {
      this.isEnableLoadingMoreDistricts = false;
    }
  }

  onWardOptionSelected(event: MatAutocompleteSelectedEvent) {
    const ward: IProvince = event.option.value;
    this.wardEl.nativeElement.value = ward.name;

    this.wardControl.setValue(ward);
  }

  onWardsScrollBottom() {
    this.isShowLoadingMoreWards = true;
    const { size, page, totalItems, totalPages } = this.bWardsPagination.getValue();
    if (page < totalPages) {
      this.bWardsPagination.next({
        size,
        page: page + 1,
        totalItems,
        totalPages
      });
    }else {
      this.isEnableLoadingMoreWards = false;
    }
  }

  private setProvince$() {
    const provinces$: Observable<TAddressMetaData<IProvince[]>> = this.bProvinceInputChange.asObservable().pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        return this.bProvincesPagination.asObservable().pipe(
          distinctUntilChanged((prev, curr) => prev.page === curr.page && prev.size === curr.size),
          switchMap(paging => {
            return this.tinhthanhphoComApiService.getProvinces(value, paging.size, paging.page);
          })
        )
      })
    );
    this.provincesData$ = provinces$.pipe(
      tap(res => {
        this.bProvincesPagination.next(res.paging);
      }),
      scan((acc, curr) => {
        this.isShowLoadingMoreProvinces = false;
        if (curr.paging.page > 1) return [...acc, ...curr.data];
        // Nếu là trang tiếp theo, nối dữ liệu
        return curr.data;
      }, [] as IProvince[])
    );
  }

  private setDistrict$(provinceCode: string) {
    const district$ = this.bDistrictInputChange.pipe(
      startWith(''),
      distinctUntilChanged(),
      switchMap(value => this.tinhthanhphoComApiService.getDistricts(provinceCode, value)
      ));
    this.districtsData$ = district$.pipe(
      tap(res => {
        this.bDistrictsPagination.next(res.paging);
      }),
      scan((acc, curr) => {
        this.isShowLoadingMoreDistricts = false;
        if (curr.paging.page > 1) return [...acc, ...curr.data];
        // Nếu là trang tiếp theo, nối dữ liệu
        return curr.data;
      }, [] as IDistrict[])
    );
  }

  private setWard$(districtCode: string) {
    const wards$ = this.bWardInputChange.pipe(
      startWith(''),
      distinctUntilChanged(),
      switchMap(value => this.tinhthanhphoComApiService.getWards(districtCode, value))
    );

    this.wardsData$ = wards$.pipe(
      tap(res => {
        this.bWardsPagination.next(res.paging);
      }),
      scan((acc, curr) => {
        this.isShowLoadingMoreWards = false;
        if (curr.paging.page > 1) return [...acc, ...curr.data];
        // Nếu là trang tiếp theo, nối dữ liệu
        return curr.data;
      }, [] as IWard[])
    );
  }

  ngAfterViewInit(): void {
    this.provinceEl.nativeElement.value = this.address?.province?.name ?? '';
    this.districtEl.nativeElement.value = this.address?.district?.name ?? '';
    this.wardEl.nativeElement.value = this.address?.ward?.name ?? '';

    this.renderer.listen(this.provinceEl.nativeElement, 'input', () => {
      this.bProvinceInputChange.next(this.provinceEl.nativeElement.value);
      this.bProvincesPagination.next(PaginationConstant);
    });

    this.renderer.listen(this.districtEl.nativeElement, 'input', () => {
      this.bDistrictInputChange.next(this.districtEl.nativeElement.value);
      this.bDistrictsPagination.next(PaginationConstant);
    });

    this.renderer.listen(this.wardEl.nativeElement, 'input', () => {
      this.bWardInputChange.next(this.wardEl.nativeElement.value);
      this.bWardsPagination.next(PaginationConstant);
    });
  }

  onProvinceBlur() {
    const provinceName = this.provinceControl.value?.name;
    this.provinceEl.nativeElement.value = provinceName ?? '';
  }

  onDistrictBlur() {
    const districtName = this.districtControl.value?.name;
    this.districtEl.nativeElement.value = districtName ?? '';
  }

  onWardBlur() {
    const wardName = this.wardControl.value?.name;
    this.wardEl.nativeElement.value = wardName ?? '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
