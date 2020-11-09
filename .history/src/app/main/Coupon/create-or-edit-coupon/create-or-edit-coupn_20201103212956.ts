import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, ViewEncapsulation, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CouponsServiceProxy, CouponDto, CommonLookupServiceProxy, NameValueDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { forkJoin } from 'rxjs';
import { EnumLookupType } from '../../../../shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './create-or-edit-Coupon.component.html',
    styleUrls: ['./create-or-edit-Coupon.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CreateOrEditCouponComponent extends AppComponentBase implements OnInit {
    @ViewChild("CouponForm", { static: true }) CouponForm: NgForm;

    saving = false;
    active = false;
    uploadUrl: string;
    Coupon: CouponDto;
    genders: NameValueDto[] = [];
    maritalStatuses: NameValueDto[] = [];
    countries: NameValueDto[] = [];
    regions: NameValueDto[] = [];
    cities: NameValueDto[] = [];
    nationalities: NameValueDto[] = [];
    uploadedFiles: any[] = [];
    constructor(
        injector: Injector,
        private router: Router,
        private route: ActivatedRoute,
        private _CouponsServiceProxy: CouponsServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/FileUpload/UploadFile';
    }

    ngOnInit() {
        let CouponId = this.route.snapshot.params['CouponId'];
        this.initializeObj();

        if (CouponId)
            this.getCouponForEdit(CouponId);

        var observableGenders = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.Gender,undefined);
        var observableMaritalStatuses = this._commonLookupServiceProxy.getLookupsByLookupTypeId(EnumLookupType.MaritalStatuses,undefined);
        var observableCountries = this._commonLookupServiceProxy.getCountriesForComboBox('')
        var observableNationalities = this._commonLookupServiceProxy.getNationalitiesForComboBox('');
        forkJoin([observableGenders, observableMaritalStatuses, observableCountries, observableNationalities])
            .subscribe(([genders, maritalStatuses, countries, nationalities]) => {
                this.genders = genders;
                this.maritalStatuses = maritalStatuses;
                this.countries = countries;
                this.nationalities = nationalities;
            });
    }

    initializeObj() {
        this.active = true;
        this.Coupon = new CouponDto();
        this.Coupon.isActive = true;
        this.Coupon.genderId = null;
        this.Coupon.maritalStatusId = null;
        this.Coupon.nationalityId = null;
        this.Coupon.countryId = null;
        this.Coupon.regionId = null;
        this.Coupon.cityId = null;
        this.Coupon.dateOfBirth = moment().startOf('day');
    }

    getCouponForEdit(CouponId) {
        this.primengTableHelper.showLoadingIndicator();
        this._CouponsServiceProxy.getCouponForEdit(CouponId).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(Coupon => {
            this.Coupon = Coupon;
            if (this.Coupon.countryId)
                this.onChangeCountry();

            if (this.Coupon.regionId)
                this.onChangeRegions();

            this.active = true;

        });
    }

    onChangeCountry() {
        this._commonLookupServiceProxy.getRegionsForComboBox(this.Coupon.countryId, '').subscribe(regions => {
            this.regions = regions;
        });
    }
    
    onChangeRegions() {
        this._commonLookupServiceProxy.getCitiesForComboBox(this.Coupon.regionId, '').subscribe(regions => {
            this.cities = regions;
        });
    }

    confirmSave() {
        this.message.confirm(
            this.l('SaveCouponData'),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this.saveCoupon();
                }
            }
        );
    }

    saveCoupon() {
        this.primengTableHelper.showLoadingIndicator();
        this.saving = true;
        this._CouponsServiceProxy.createOrUpdateCoupon(this.Coupon)
            .pipe(finalize(() => {
                this.saving = false;
                this.primengTableHelper.showLoadingIndicator();
            }))
            .subscribe(result => {
                this.message.success(this.l('SavedSuccessfully'));
                this.close()
            });
    }

    close() {
        this.router.navigate(['/app/main/Coupons']);
        }

    onUpload(event): void {
        var imgSrc = event.originalEvent.body.result.virtualPath;
        this.Coupon.personalPhoto = imgSrc;
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

    onBeforeSend(event): void {
        event.xhr.setRequestHeader('Authorization', 'Bearer ' + abp.auth.getToken());
    }
}
