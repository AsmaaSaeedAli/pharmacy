import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, ViewEncapsulation, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CustomersServiceProxy, CustomerDto, CommonLookupServiceProxy, NameValueDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { forkJoin } from 'rxjs';
import { EnumLookupType } from '../../../../shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './create-or-edit-customer.component.html',
    styleUrls: ['./create-or-edit-customer.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CreateOrEditCustomerComponent extends AppComponentBase implements OnInit {
    @ViewChild("customerForm", { static: true }) customerForm: NgForm;

    saving = false;
    active = false;
    uploadUrl: string;
    customer: CustomerDto;
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
        private _customersServiceProxy: CustomersServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/FileUpload/UploadFile';
    }

    ngOnInit() {
        let customerId = this.route.snapshot.params['customerId'];
        this.initializeObj();

        if (customerId)
            this.getCustomerForEdit(customerId);

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
        this.customer = new CustomerDto();
        this.customer.isActive = true;
        this.customer.genderId = null;
        this.customer.maritalStatusId = null;
        this.customer.nationalityId = null;
        this.customer.countryId = null;
        this.customer.regionId = null;
        this.customer.cityId = null;
        this.customer.dateOfBirth = moment().startOf('day');
    }

    getCustomerForEdit(customerId) {
        this.primengTableHelper.showLoadingIndicator();
        this._customersServiceProxy.getCustomerForEdit(customerId).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(customer => {
            this.customer = customer;
            if (this.customer.countryId)
                this.onChangeCountry();

            if (this.customer.regionId)
                this.onChangeRegions();

            this.active = true;

        });
    }

    onChangeCountry() {
        this._commonLookupServiceProxy.getRegionsForComboBox(this.customer.countryId, '').subscribe(regions => {
            this.regions = regions;
        });
    }
    
    onChangeRegions() {
        this._commonLookupServiceProxy.getCitiesForComboBox(this.customer.regionId, '').subscribe(regions => {
            this.cities = regions;
        });
    }

    confirmSave() {
        this.message.confirm(
            this.l('SaveCustomerData'),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this.saveCustomer();
                }
            }
        );
    }

    saveCustomer() {
        this.primengTableHelper.showLoadingIndicator();
        this.saving = true;
        this._customersServiceProxy.createOrUpdateCustomer(this.customer)
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
        this.router.navigate(['/app/main/customers']);
        }

    onUpload(event): void {
        var imgSrc = event.originalEvent.body.result.virtualPath;
        this.customer.personalPhoto = imgSrc;
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

    onBeforeSend(event): void {
        event.xhr.setRequestHeader('Authorization', 'Bearer ' + abp.auth.getToken());
    }
}
